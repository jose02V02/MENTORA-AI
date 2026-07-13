import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface FeynmanEvaluation {
  score: number; // 0 to 100
  feedback: string;
  missingConcepts: string[];
}

export class FeynmanAgent {
  /**
   * Evaluates the student's explanation of a concept.
   */
  static async evaluate(
    studentExplanation: string, 
    trueContext: string
  ): Promise<FeynmanEvaluation> {
    
    const prompt = `
      Sei il Feynman Agent di Mentora AI. Il tuo obiettivo è valutare la spiegazione fornita da uno studente su un concetto, confrontandola con la verità (il contesto).
      Devi calcolare un punteggio di comprensione (da 0 a 100), fornire un feedback costruttivo e identificare quali concetti chiave mancano o sono sbagliati.

      Contesto Reale:
      """
      ${trueContext}
      """

      Spiegazione dello Studente:
      """
      ${studentExplanation}
      """
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        score: { type: Type.INTEGER, description: "Punteggio da 0 a 100" },
        feedback: { type: Type.STRING, description: "Feedback costruttivo per lo studente (tono incoraggiante)" },
        missingConcepts: { 
          type: Type.ARRAY, 
          items: { type: Type.STRING },
          description: "Lista di parole chiave o concetti che lo studente ha dimenticato o frainteso"
        }
      },
      required: ["score", "feedback", "missingConcepts"]
    };

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.2,
        }
      });

      if (!response.text) throw new Error("No response");

      return JSON.parse(response.text) as FeynmanEvaluation;
    } catch (error) {
      console.error("FeynmanAgent Error:", error);
      throw new Error("Failed to evaluate explanation.");
    }
  }
}
