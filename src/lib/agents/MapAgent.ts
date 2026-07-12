import { GoogleGenAI, Type, Schema } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

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
   * Processes raw text to extract core concepts and their relationships using Gemini.
   */
  static async extractKnowledgeGraph(text: string): Promise<MapAgentResult> {
    const prompt = `
    Sei il Map Agent di Mentora AI. Il tuo compito è leggere il seguente testo didattico ed estrarne i concetti fondamentali e le relazioni tra essi per costruire un Knowledge Graph.
    
    Testo da analizzare:
    """
    ${text.substring(0, 30000)} // Limite per sicurezza, Gemini supporta molto di più
    """
    `;

    const responseSchema: Schema = {
      type: Type.OBJECT,
      properties: {
        concepts: {
          type: Type.ARRAY,
          description: "Lista dei concetti principali trovati nel testo",
          items: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING, description: "Nome del concetto" },
              description: { type: Type.STRING, description: "Descrizione chiara e concisa del concetto" },
            },
            required: ["name", "description"]
          }
        },
        edges: {
          type: Type.ARRAY,
          description: "Lista delle relazioni tra i concetti estratti",
          items: {
            type: Type.OBJECT,
            properties: {
              sourceConcept: { type: Type.STRING, description: "Nome del concetto di partenza (deve esistere in concepts)" },
              targetConcept: { type: Type.STRING, description: "Nome del concetto di destinazione (deve esistere in concepts)" },
              relationship: { type: Type.STRING, description: "Tipo di relazione (es. 'is_a', 'part_of', 'causes', 'prerequisite_for')" },
            },
            required: ["sourceConcept", "targetConcept", "relationship"]
          }
        }
      },
      required: ["concepts", "edges"]
    };

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-pro",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.2, // Bassa temperatura per maggiore precisione
        }
      });

      if (!response.text) {
          throw new Error("No response text from Gemini");
      }

      const result: MapAgentResult = JSON.parse(response.text);
      return result;
    } catch (error) {
      console.error("MapAgent Extraction Error:", error);
      throw new Error("Failed to extract Knowledge Graph using Gemini.");
    }
  }
}
