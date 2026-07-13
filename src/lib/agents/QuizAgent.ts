import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
    const systemPrompt = `Sei il Quiz Agent di Mentora AI. Il tuo obiettivo è generare un quiz stimolante basato sul contesto fornito estratto dal documento dello studente.
Genera esattamente ${numQuestions} domande miste tra scelta multipla (con 4 opzioni) e vero/falso.
Assicurati che le domande testino la vera comprensione, non solo la memoria meccanica.
Devi rispondere SOLO con un oggetto JSON valido contenente un array "questions", senza alcun testo aggiuntivo:
{
  "questions": [
    {
      "question": "Testo domanda",
      "type": "multiple_choice",
      "options": ["Opzione A", "Opzione B", "Opzione C", "Opzione D"],
      "correctAnswer": "Opzione B",
      "explanation": "Perché è corretta"
    },
    {
      "question": "Testo domanda V/F",
      "type": "true_false",
      "correctAnswer": "Vero",
      "explanation": "Perché è vero"
    }
  ]
}`;

    const userPrompt = `Contesto:\n"""\n${context}\n"""`;

    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.4,
      });

      const responseText = response.choices[0]?.message?.content;
      if (!responseText) throw new Error("No response");

      const parsed = JSON.parse(responseText);
      return parsed.questions as QuizQuestion[];
    } catch (error) {
      console.error("QuizAgent Error:", error);
      throw new Error("Failed to generate quiz using Groq.");
    }
  }
}
