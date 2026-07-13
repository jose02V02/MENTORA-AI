import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

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
    
    const systemPrompt = `Sei il Feynman Agent di Mentora AI. Il tuo obiettivo è valutare la spiegazione fornita da uno studente su un concetto, confrontandola con la verità (il contesto).
Devi calcolare un punteggio di comprensione (da 0 a 100), fornire un feedback costruttivo e identificare quali concetti chiave mancano o sono sbagliati.
Devi rispondere SOLO con un oggetto JSON valido, senza testo aggiuntivo, con la seguente struttura:
{
  "score": 85,
  "feedback": "Ottimo lavoro! Hai capito il nucleo, ma ti sei perso...",
  "missingConcepts": ["Concetto 1", "Concetto 2"]
}`;

    const userPrompt = `Contesto Reale:\n"""\n${trueContext}\n"""\n\nSpiegazione dello Studente:\n"""\n${studentExplanation}\n"""`;

    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" },
        temperature: 0.2,
      });

      const responseText = response.choices[0]?.message?.content;
      if (!responseText) throw new Error("No response");

      return JSON.parse(responseText) as FeynmanEvaluation;
    } catch (error) {
      console.error("FeynmanAgent Error:", error);
      throw new Error("Failed to evaluate explanation using Groq.");
    }
  }
}
