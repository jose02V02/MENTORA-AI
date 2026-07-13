import { NextRequest, NextResponse } from "next/server";
import { ContentExtractor } from "@/lib/ContentExtractor";
import { MapAgent } from "@/lib/agents/MapAgent";

import { PrismaClient } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const url = formData.get("url") as string | null;
    const file = formData.get("file") as File | null;
    const userId = "temp-user-id"; // TODO: Implement real authentication

    let rawText = "";
    let title = "Documento Generico";
    let type = "text";

    // 1. Estrazione del testo
    if (url) {
      rawText = await ContentExtractor.fromUrl(url);
      title = url;
      type = "web";
    } else if (file) {
      title = file.name;
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      if (file.type === "application/pdf") {
        rawText = await ContentExtractor.fromPdf(buffer);
        type = "pdf";
      } else {
        rawText = await ContentExtractor.fromText(buffer);
      }
    } else {
      return NextResponse.json({ error: "Nessun URL o file fornito." }, { status: 400 });
    }

    if (!rawText) {
        return NextResponse.json({ error: "Nessun testo estratto." }, { status: 400 });
    }

    // Temporary User creation for testing since we don't have auth yet
    const user = await prisma.user.upsert({
      where: { id: userId },
      update: {},
      create: { id: userId, email: "test@mentora.ai", name: "Studente Test" }
    });

    // 2. Salvataggio Documento grezzo
    const document = await prisma.document.create({
      data: {
        userId: user.id,
        title,
        type,
        content: rawText,
        url: url || null
      }
    });

    // 3. Estrazione Knowledge Graph (Map Agent)
    const mapResult = await MapAgent.extractKnowledgeGraph(rawText);

    // 4. Salvataggio Concetti
    const conceptMap = new Map<string, string>(); // Maps Concept Name -> DB ID

    for (const concept of mapResult.concepts) {
      // Create concept in DB
      const dbConcept = await prisma.concept.create({
        data: {
          name: concept.name,
          description: concept.description,
          documentId: document.id,
        }
      });
      conceptMap.set(concept.name, dbConcept.id);
    }

    // 5. Creazione Relazioni (Edges)
    for (const edge of mapResult.edges) {
      const sourceId = conceptMap.get(edge.sourceConcept);
      const targetId = conceptMap.get(edge.targetConcept);

      if (sourceId && targetId) {
        await prisma.conceptEdge.create({
          data: {
            sourceId,
            targetId,
            relationship: edge.relationship
          }
        });
      }
    }

    return NextResponse.json({ 
        success: true, 
        message: "Documento elaborato con successo!",
        documentId: document.id,
        conceptsExtracted: mapResult.concepts.length,
        edgesCreated: mapResult.edges.length
    });

  } catch (error: any) {
    console.error("Ingestion API Error:", error);
    return NextResponse.json({ error: error.message || "Errore interno" }, { status: 500 });
  }
}
