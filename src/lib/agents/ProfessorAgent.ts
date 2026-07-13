import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export class ProfessorAgent {
  /**
   * Drives the "Interrogate Me" mode. 
   * Strict, probing, demands deep understanding.
   */
  static async interrogate(
    message: string, 
    context: string, 
    history: { role: string, content: string }[] = []
  ): Promise<string> {
    
    const systemPrompt = `Sei il Professor Agent di Mentora AI. Sei un professore universitario estremamente severo ma giusto.
L'utente ha attivato la "Modalità Professore" ("Interrogami"). 

Il tuo obiettivo è:
1. Fare domande incalzanti e a bruciapelo basate sul contesto.
2. Chiedere collegamenti tra concetti diversi.
3. Se l'utente risponde, devi dare un "Voto" rapido in decimi (es. Voto: 6/10) e spiegare dove ha sbagliato o cosa manca, per poi fargli un'altra domanda più difficile.
4. Se l'utente è confuso, non dargli la risposta subito, ma guidalo con una domanda sbarrativa.
5. Il tuo tono deve essere accademico, formale, rigoroso. Niente incoraggiamenti sdolcinati.

Contesto dell'argomento:
"""
${context}
"""`;

    const messages: any[] = [
      { role: "system", content: systemPrompt },
      { role: "assistant", content: "Cominciamo subito l'interrogazione." }
    ];
    
    for (const msg of history) {
      messages.push({ 
        role: msg.role === "user" ? "user" : "assistant", 
        content: msg.content 
      });
    }
    
    messages.push({ role: "user", content: message });

    try {
      const response = await groq.chat.completions.create({
        model: "llama-3.3-70b-versatile",
        messages: messages,
        temperature: 0.3, // Bassa temperatura per rigore logico
      });

      return response.choices[0]?.message?.content || "Errore di valutazione accademica.";
    } catch (error) {
      console.error("ProfessorAgent Error:", error);
      throw new Error("Failed to generate professor response using Groq.");
    }
  }
}
