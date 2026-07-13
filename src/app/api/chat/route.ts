import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { TeacherAgent } from "@/lib/agents/TeacherAgent";
import { FeynmanAgent } from "@/lib/agents/FeynmanAgent";
import { ProfessorAgent } from "@/lib/agents/ProfessorAgent";

import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { documentId, message, isFeynmanMode, isProfessorMode } = await req.json();
    const userId = "temp-user-id"; // TODO: Implement Auth

    if (!documentId || !message) {
      return NextResponse.json({ error: "Mancano parametri (documentId, message)" }, { status: 400 });
    }

    // 1. Recupera Documento e Concetti per il contesto
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: { concepts: true }
    });

    if (!document) {
      return NextResponse.json({ error: "Documento non trovato" }, { status: 404 });
    }

    const context = document.concepts.map((c: any) => `- ${c.name}: ${c.description}`).join("\n");

    // 2. Recupera LearningDNA dello studente
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { learningDNA: true }
    });

    // 3. Salva il messaggio dell'utente
    await prisma.interaction.create({
      data: { userId, role: "user", content: message }
    });

    // 4. Seleziona l'Agente corretto
    let responseText = "";

    if (isFeynmanMode) {
      // Usa l'Agente Feynman per valutare
      const evaluation = await FeynmanAgent.evaluate(message, context);
      responseText = `**Valutazione Comprensione: ${evaluation.score}%**\n\n${evaluation.feedback}`;
      
      if (evaluation.missingConcepts.length > 0) {
        responseText += `\n\n*Ricorda di ripassare:* ${evaluation.missingConcepts.join(", ")}`;
      }
    } else if (isProfessorMode) {
      // Recupera ultimi 5 messaggi
      const history = await prisma.interaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5
      });
      const formattedHistory = history.reverse().map((h: any) => ({ role: h.role, content: h.content }));

      // Usa il Professor Agent
      responseText = await ProfessorAgent.interrogate(message, context, formattedHistory);
    } else {
      // Recupera ultimi 5 messaggi per la cronologia
      const history = await prisma.interaction.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        take: 5
      });
      const formattedHistory = history.reverse().map((h: any) => ({ role: h.role, content: h.content }));

      // Usa l'Agente Insegnante per rispondere
      responseText = await TeacherAgent.teach(message, context, user?.learningDNA || null, formattedHistory);
    }

    // 5. Salva la risposta dell'Agente
    await prisma.interaction.create({
      data: { userId, role: isFeynmanMode ? "feynman" : isProfessorMode ? "professor" : "teacher", content: responseText }
    });

    return NextResponse.json({ response: responseText });

  } catch (error: any) {
    console.error("Chat API Error:", error);
    return NextResponse.json({ error: error.message || "Errore interno della chat" }, { status: 500 });
  }
}
