"use client";

import { useState, useRef, useEffect, use } from "react";
import { Send, User, Bot, Loader2, Sparkles, AlertTriangle, Hexagon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface Message {
  role: "user" | "teacher" | "feynman" | "professor";
  content: string;
}

export default function Classroom({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [messages, setMessages] = useState<Message[]>([
    { role: "teacher", content: "Ciao! Sono il tuo tutor Mentora. Ho analizzato il tuo documento, dimmi da dove vuoi iniziare o chiedimi di spiegarti il concetto principale!" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFeynmanMode, setIsFeynmanMode] = useState(false);
  const [isProfessorMode, setIsProfessorMode] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input;
    setInput("");
    setMessages(prev => [...prev, { role: "user", content: userMessage }]);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          documentId: resolvedParams.id,
          message: userMessage,
          isFeynmanMode,
          isProfessorMode
        })
      });

      const data = await response.json();
      
      setMessages(prev => [...prev, { 
        role: isFeynmanMode ? "feynman" : isProfessorMode ? "professor" : "teacher", 
        content: data.response || data.error 
      }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { role: "teacher", content: "Errore di connessione col server AI." }]);
    } finally {
      setIsLoading(false);
      // Turn off Feynman mode after one evaluation
      if (isFeynmanMode) setIsFeynmanMode(false);
    }
  };

  return (
    <div className="flex h-screen bg-white text-zinc-900 overflow-hidden font-sans relative">
      
      {/* High-Tech Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `linear-gradient(rgba(220, 38, 38, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(220, 38, 38, 0.05) 1px, transparent 1px)`,
          backgroundSize: "20px 20px"
        }}
      />
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-amber-400/10 rounded-full blur-[120px] z-0 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-red-600/10 rounded-full blur-[120px] z-0 pointer-events-none" />

      {/* Sidebar - Knowledge Graph & Stats */}
      <div className="w-1/4 bg-zinc-50/80 border-r border-zinc-200 hidden md:flex flex-col p-6 relative z-10 backdrop-blur-md shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <h2 className="text-xl font-black mb-8 flex items-center gap-3 text-zinc-900 tracking-tight">
          <Hexagon className="w-6 h-6 text-red-600" /> Mentora AI
        </h2>
        
        <div className="flex-1 bg-white rounded-2xl border border-zinc-100 p-5 overflow-y-auto shadow-sm relative group">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 to-red-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-500" />
          <p className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-6">Knowledge Graph Map</p>
          {/* Qui andrà React Flow con la mappa dei concetti */}
          <div className="animate-pulse space-y-5">
            <div className="h-12 bg-zinc-100 rounded-xl w-3/4 mx-auto border border-zinc-200" />
            <div className="flex justify-center gap-4">
               <div className="h-12 bg-zinc-100 rounded-xl w-1/3 border border-zinc-200" />
               <div className="h-12 bg-zinc-100 rounded-xl w-1/3 border border-zinc-200" />
            </div>
            <div className="h-12 bg-zinc-100 rounded-xl w-1/2 mx-auto border border-zinc-200" />
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-zinc-200">
          <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-4">Modalità Sincronizzazione</p>
          <div className="flex flex-col gap-3">
            <Button 
              variant="outline" 
              onClick={() => { setIsFeynmanMode(false); setIsProfessorMode(false); }}
              className={!isFeynmanMode && !isProfessorMode ? "bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800" : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"}
            >
              Supporto Base
            </Button>
            <Button 
              variant="outline" 
              onClick={() => { setIsFeynmanMode(true); setIsProfessorMode(false); }}
              className={isFeynmanMode ? "bg-amber-500 text-white border-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/20" : "bg-white border-zinc-200 text-zinc-600 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200"}
            >
              Protocollo Feynman
            </Button>
            <Button 
              variant="outline" 
              onClick={() => { setIsProfessorMode(true); setIsFeynmanMode(false); }}
              className={isProfessorMode ? "bg-red-600 text-white border-red-600 hover:bg-red-700 shadow-lg shadow-red-600/20" : "bg-white border-zinc-200 text-zinc-600 hover:bg-red-50 hover:text-red-600 hover:border-red-200"}
            >
              Modalità Professore
            </Button>
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative z-10">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-white to-transparent pointer-events-none z-20" />
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8 space-y-8 pb-32">
          {messages.map((msg, index) => (
            <motion.div 
              key={index} 
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3 }}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-4 max-w-[85%] ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  msg.role === "user" ? "bg-zinc-900 text-white" : 
                  msg.role === "feynman" ? "bg-amber-500 text-white" : 
                  msg.role === "professor" ? "bg-red-600 text-white" : "bg-white border border-zinc-200 text-red-600"
                }`}>
                  {msg.role === "user" ? <User size={24} /> : <Bot size={24} />}
                </div>

                <div className={`p-5 rounded-3xl shadow-sm border ${
                  msg.role === "user" ? "bg-zinc-900 text-white border-zinc-800 rounded-tr-sm" : 
                  msg.role === "feynman" ? "bg-amber-50 border-amber-200 text-amber-900 rounded-tl-sm" :
                  msg.role === "professor" ? "bg-red-50 border-red-200 text-red-900 rounded-tl-sm" :
                  "bg-white border-zinc-100 text-zinc-800 rounded-tl-sm shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-[15px]">{msg.content}</p>
                </div>
              </div>
            </motion.div>
          ))}
          
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-4 max-w-[80%]">
                <div className="w-12 h-12 rounded-2xl bg-white border border-zinc-200 flex items-center justify-center text-red-600 shadow-sm">
                  <Bot size={24} />
                </div>
                <div className="p-5 rounded-3xl bg-white border border-zinc-100 flex items-center gap-4 shadow-sm rounded-tl-sm">
                  <Loader2 className="w-5 h-5 animate-spin text-red-500" />
                  <span className="text-zinc-500 text-[15px] font-medium">Elaborazione neurale in corso...</span>
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} className="h-4" />
        </div>

        {/* Input Area */}
        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-white via-white to-transparent pt-12">
          <div className="max-w-4xl mx-auto">
            {isFeynmanMode && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 px-5 py-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-3 text-amber-800 text-sm font-medium shadow-sm">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Protocollo Feynman Attivo: Inserisci la tua esposizione per l'analisi logica.
              </motion.div>
            )}
            {isProfessorMode && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-4 px-5 py-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-red-800 text-sm font-medium shadow-sm">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                Modalità Professore Attiva: Livello di rigore accademico massimo. Preparati.
              </motion.div>
            )}
            
            <div className="relative flex items-end gap-3 bg-white border-2 border-zinc-200 rounded-3xl p-2 shadow-[0_8px_30px_rgb(0,0,0,0.04)] focus-within:border-red-400 focus-within:shadow-[0_8px_30px_rgba(220,38,38,0.08)] transition-all duration-300">
              <textarea 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isFeynmanMode ? "Trascrivi qui la tua argomentazione..." : isProfessorMode ? "Rispondi al quesito del professore..." : "Inserisci una query per il tutor..."}
                className="w-full bg-transparent border-none outline-none px-5 py-4 text-[15px] text-zinc-800 placeholder-zinc-400 font-medium resize-none overflow-hidden min-h-[56px] max-h-[200px]"
                rows={Math.min(5, input.split('\\n').length || 1)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
              />
              <Button 
                onClick={handleSend}
                disabled={isLoading || !input.trim()}
                className="shrink-0 h-14 w-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl shadow-md shadow-red-600/20 transition-transform active:scale-95 disabled:opacity-50 disabled:active:scale-100"
              >
                <Send size={20} className="ml-1" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
