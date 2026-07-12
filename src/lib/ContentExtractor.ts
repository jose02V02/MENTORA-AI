import * as cheerio from "cheerio";
import * as pdfParse from "pdf-parse";

export class ContentExtractor {
  
  /**
   * Extracts text from a given web URL.
   */
  static async fromUrl(url: string): Promise<string> {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch URL");
      
      const html = await response.text();
      const $ = cheerio.load(html);
      
      // Remove scripts, styles, and non-content elements
      $("script, style, noscript, nav, footer, header, aside").remove();
      
      // Extract main text
      const text = $("body").text().replace(/\s+/g, " ").trim();
      return text;
    } catch (error) {
      console.error("Error extracting from URL:", error);
      throw new Error("Could not extract content from the provided link.");
    }
  }

  /**
   * Extracts text from a PDF Buffer.
   */
  static async fromPdf(buffer: Buffer): Promise<string> {
    try {
      const data = await (pdfParse as any)(buffer);
      return data.text.replace(/\s+/g, " ").trim();
    } catch (error) {
      console.error("Error parsing PDF:", error);
      throw new Error("Could not extract text from the PDF.");
    }
  }

  /**
   * Extracts text from plain text files.
   */
  static async fromText(buffer: Buffer): Promise<string> {
    return buffer.toString("utf-8");
  }
}
