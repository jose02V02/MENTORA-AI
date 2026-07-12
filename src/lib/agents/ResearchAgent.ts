import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export class ResearchAgent {
  /**
   * Generates a vector embedding for a given text using Gemini's text-embedding-004 model.
   * The text-embedding-004 model produces 768-dimensional embeddings by default,
   * so we will need to ensure our database schema handles 768 dimensions instead of 1536 (OpenAI).
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await ai.models.embedContent({
        model: "text-embedding-004",
        contents: text,
      });

      if (!response.embeddings || response.embeddings.length === 0 || !response.embeddings[0].values) {
        throw new Error("No embedding values returned from Gemini.");
      }

      return response.embeddings[0].values;
    } catch (error) {
      console.error("ResearchAgent Embedding Error:", error);
      throw new Error("Failed to generate embedding using Gemini.");
    }
  }
}
