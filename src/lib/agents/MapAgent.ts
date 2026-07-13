import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export interface ExtractedConcept {
  name: string;
  description: string;
}

export interface ExtractedEdge {
  sourceConcept: string;
  targetConcept: string;
  relationship: string;
}

export interface MapAgentResult {
  concepts: ExtractedConcept[];
  edges: ExtractedEdge[];
}

export class MapAgent {
  /**
   * Processes raw text to extract core concepts and their relationships using Groq.
   */
  static async extractKnowledgeGraph(text: string): Promise<MapAgentResult> {
    const systemPrompt = `Sei il Map Agent di Mentora AI. Il tuo compito è leggere il testo didattico fornito ed estrarne i concetti fondamentali e le relazioni tra essi per costruire un Knowledge Graph.
Devi rispondere SOLO con un oggetto JSON valido con la seguente struttura, senza alcun testo aggiuntivo:
{
  "concepts": [
    { "name": "Nome", "description": "Descrizione chiara" }
  ],
  "edges": [
    { "sourceConcept": "Nome1", "targetConcept": "Nome2", "relationship": "is_a|part_of|causes|prerequisite_for" }
  ]
}
Tutti i nomi nei concetti devono essere stringhe univoche, e le relazioni devono fare riferimento ESATTAMENTE a quei nomi.`;

    const userPrompt = `Testo da analizzare:\n"""\n${text.substring(0, 30000)}\n"""`;

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
      if (!responseText) {
          throw new Error("No response text from Groq");
      }

      const result: MapAgentResult = JSON.parse(responseText);
      return result;
    } catch (error) {
      console.error("MapAgent Extraction Error:", error);
      throw new Error("Failed to extract Knowledge Graph using Groq.");
    }
  }
}
