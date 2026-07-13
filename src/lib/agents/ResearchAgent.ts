import { pipeline } from '@xenova/transformers';

export class ResearchAgent {
  /**
   * Generates a vector embedding for a given text using @xenova/transformers 
   * The 'Xenova/all-MiniLM-L6-v2' model produces 384-dimensional embeddings locally.
   */
  static async generateEmbedding(text: string): Promise<number[]> {
    try {
      const extractor = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2', {
        quantized: true, // Use quantized for speed and smaller memory
      });
      
      const output = await extractor(text, { pooling: 'mean', normalize: true });
      return Array.from(output.data);
    } catch (error) {
      console.error("ResearchAgent Embedding Error:", error);
      throw new Error("Failed to generate embedding using local transformers.");
    }
  }
}
