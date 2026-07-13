import { GoogleGenAI } from "@google/genai";
import { LearningDNA } from "@prisma/client";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class TeacherAgent {
  /**
   * Generates a response tailored to the student's Learning DNA.
   */
  static async teach(
    message: string, 
    context: string, 
    dna: LearningDNA | null,
    history: { role: string, content: string }[] = []
  ): Promise<string> {
    
    // Construct the persona based on DNA
    let persona = "Sei un tutor esperto, paziente e incoraggiante.";
    if (dna) {
      persona += ` Il tuo studente impara meglio con uno stile "${dna.preferredStyle}". `;
      if (dna.strengths.length > 0) {
        persona += `I suoi punti di forza sono: ${dna.strengths.join(", ")}. Fai leva su di essi. `;
      }
      if (dna.weaknesses.length > 0) {
        persona += `Ha difficoltà con: ${dna.weaknesses.join(", ")}. Presta particolare attenzione a non confonderlo su questi temi. `;
      }
    }

    const systemPrompt = `
      ${persona}
      Regole:
      1. Non limitarti a dare la risposta. Spiega il "perché".
      2. Usa esempi o analogie se lo stile dello studente lo richiede.
      3. Mantieni le risposte concise e leggibili (usa markdown, bullet points).
      4. Ogni tanto (non sempre), concludi chiedendo "È chiaro questo passaggio?" o "Prova a farmi un esempio".
      
      Contesto pertinente dal Knowledge Graph:
      """
      ${context}
      """
    `;

    // Construct conversation history for Gemini
    const contents = [];
    contents.push({ role: "user", parts: [{ text: systemPrompt }] });
    contents.push({ role: "model", parts: [{ text: "Ricevuto. Adatterò il mio stile." }] });
    
    for (const msg of history) {
      contents.push({ 
        role: msg.role === "user" ? "user" : "model", 
        parts: [{ text: msg.content }] 
      });
    }
    
    // Add current message
    contents.push({ role: "user", parts: [{ text: message }] });

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: contents,
      });

      return response.text || "Mi spiace, non sono riuscito a elaborare una risposta.";
    } catch (error) {
      console.error("TeacherAgent Error:", error);
      throw new Error("Failed to generate response.");
    }
  }
}
