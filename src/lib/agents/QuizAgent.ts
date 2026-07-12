import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface QuizQuestion {
  question: string;
  type: "multiple_choice" | "true_false";
  options?: string[]; // Only for multiple_choice
  correctAnswer: string;
  explanation: string;
}

export class QuizAgent {
  /**
   * Generates a dynamic quiz based on the provided Knowledge Graph context.
   */
  static async generateQuiz(context: string, numQuestions: number = 5): Promise<QuizQuestion[]> {
    const prompt = `
      Sei il Quiz Agent di Mentora AI. Il tuo obiettivo è generare un quiz stimolante basato sul seguente contesto estratto dal documento dello studente.
      Genera esattamente ${numQuestions} domande miste tra scelta multipla (con 4 opzioni) e vero/falso.
      Assicurati che le domande testino la vera comprensione, non solo la memoria meccanica.
      
      Contesto:
      """
      ${context}
      """
    `;

    const responseSchema: Schema = {
      type: Type.ARRAY,
      description: "Lista di domande del quiz",
      items: {
        type: Type.OBJECT,
        properties: {
          question: { type: Type.STRING, description: "Il testo della domanda" },
          type: { type: Type.STRING, enum: ["multiple_choice", "true_false"], description: "Il tipo di domanda" },
          options: { 
            type: Type.ARRAY, 
            items: { type: Type.STRING },
            description: "Esattamente 4 opzioni se il tipo è multiple_choice. Omettere o vuoto se true_false."
          },
          correctAnswer: { type: Type.STRING, description: "La risposta corretta (deve coincidere esattamente con una delle opzioni, o 'Vero'/'Falso')" },
          explanation: { type: Type.STRING, description: "Spiegazione concisa del perché la risposta è corretta" }
        },
        required: ["question", "type", "correctAnswer", "explanation"]
      }
    };

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.4, // Un po' di creatività per domande diverse
        }
      });

      if (!response.text) throw new Error("No response");

      return JSON.parse(response.text) as QuizQuestion[];
    } catch (error) {
      console.error("QuizAgent Error:", error);
      throw new Error("Failed to generate quiz.");
    }
  }
}
