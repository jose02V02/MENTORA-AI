"use client";

import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRouter } from "next/navigation";
import { Upload, Link as LinkIcon, Sparkles, BookOpen, Brain, GitMerge, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const router = useRouter();

  const handleProcess = async () => {
    if (!inputValue.trim()) return;
    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      // Verifichiamo se l'input sembra un URL
      if (inputValue.startsWith("http://") || inputValue.startsWith("https://")) {
        formData.append("url", inputValue.trim());
      } else {
        alert("Per ora supportiamo solo link (URL di siti web o video YouTube). Inserisci un link valido.");
        setIsAnalyzing(false);
        return;
      }

      const res = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || "Errore durante l'elaborazione");
      }

      const data = await res.json();
      if (data.success && data.documentId) {
        router.push(`/classroom/${data.documentId}`);
      } else {
        throw new Error(data.error || "Risposta server non valida");
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "Qualcosa è andato storto.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col items-center p-6 relative overflow-hidden font-sans">
      
      {/* Dynamic Futuristic Background */}
      <motion.div 
        className="absolute inset-0 z-0 pointer-events-none opacity-20"
        style={{
          backgroundImage: `linear-gradient(90deg, transparent 95%, rgba(220, 38, 38, 0.1) 100%),
                            linear-gradient(0deg, transparent 95%, rgba(220, 38, 38, 0.1) 100%)`,
          backgroundSize: "40px 40px"
        }}
        animate={{ backgroundPosition: ["0px 0px", "40px 40px"] }}
        transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
      />

      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-red-600/10 rounded-full blur-[100px] z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-amber-500/10 rounded-full blur-[100px] z-0" />

      {/* Floating Geometric Shapes */}
      <motion.div 
        animate={{ rotate: 360, y: [0, -20, 0] }} 
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-[10%] right-[15%] w-32 h-32 border border-amber-400/30 rounded-full z-0"
      />
      <motion.div 
        animate={{ rotate: -360, x: [0, 20, 0] }} 
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-[20%] left-[10%] w-48 h-48 border border-red-500/20 rounded-lg rotate-45 z-0"
      />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
          }
        }}
        className="w-full max-w-5xl pt-20 pb-32 relative z-10"
      >
        <motion.div 
          variants={{
            hidden: { opacity: 0, scale: 0.9, y: 20 },
            visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", bounce: 0.4 } }
          }}
          className="text-center space-y-6"
        >
          <motion.div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-100 border border-amber-200 text-amber-700 text-sm font-semibold tracking-wider uppercase shadow-sm"
            whileHover={{ scale: 1.05 }}
          >
            <Sparkles className="w-4 h-4" /> Next-Gen Learning
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter">
            <span className="text-zinc-900">Mentora</span> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-amber-500"> AI</span>
          </h1>
          <p className="text-xl text-zinc-600 max-w-2xl mx-auto font-medium">
            L'evoluzione dello studio. Inserisci i tuoi dati e il sistema neutrale estrarrà il sapere, forgiando un Knowledge Graph dinamico.
          </p>
        </motion.div>

        {/* The Magic Input Bar */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
          }}
          className="relative mt-16 bg-white/80 border-2 border-zinc-100 p-3 rounded-2xl flex items-center shadow-[0_20px_50px_-12px_rgba(220,38,38,0.15)] backdrop-blur-xl"
          whileHover={{ scale: 1.01, boxShadow: "0 25px 50px -12px rgba(245,158,11,0.2)" }}
        >
          <div className="pl-4 flex items-center justify-center text-red-500">
            <LinkIcon className="w-6 h-6" />
          </div>
          <input 
            type="text" 
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Inizializza scansione URL o trascina file..."
            className="w-full bg-transparent border-none outline-none px-4 py-4 text-lg text-zinc-800 placeholder-zinc-400 font-medium"
            onKeyDown={(e) => e.key === "Enter" && handleProcess()}
          />
          <div className="flex gap-3 pr-2">
            <Button variant="outline" className="rounded-xl px-4 border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-red-600 transition-colors">
              <Upload className="w-5 h-5 mr-2" />
              File
            </Button>
            <Button 
              onClick={handleProcess}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-xl px-8 py-6 text-lg font-bold shadow-lg shadow-red-500/30 transition-all border-none relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              {isAnalyzing ? (
                <span className="flex items-center gap-2 relative z-10">
                  <Sparkles className="w-5 h-5 animate-spin" /> Processamento...
                </span>
              ) : (
                <span className="flex items-center gap-2 relative z-10">
                  Inizia <ChevronRight className="w-5 h-5" />
                </span>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
          <FeatureCard 
            icon={<Brain className="w-8 h-8 text-amber-500" />}
            title="Learning DNA"
            description="L'IA profila le tue sinapsi di apprendimento. Stile visivo, ritenzione mnemonica e logica adattiva."
            delay={0.1}
          />
          <FeatureCard 
            icon={<GitMerge className="w-8 h-8 text-red-500" />}
            title="Knowledge Graph"
            description="I concetti si uniscono in una rete neurale visiva. Nessuna nozione rimane isolata nel tuo database personale."
            delay={0.2}
          />
          <FeatureCard 
            icon={<BookOpen className="w-8 h-8 text-zinc-800" />}
            title="Metodo Feynman"
            description="Simulazione di rigore accademico. Esponi il concetto, il sistema rileverà le anomalie logiche."
            delay={0.3}
          />
        </div>
      </motion.div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 25 } }
      }}
      whileHover={{ y: -10, scale: 1.02 }}
      className="bg-white border border-zinc-100 p-8 rounded-3xl text-left shadow-xl shadow-zinc-200/50 relative overflow-hidden group"
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-amber-400 to-red-500 transform origin-top scale-y-0 group-hover:scale-y-100 transition-transform duration-500" />
      <div className="mb-6 bg-zinc-50 w-16 h-16 rounded-2xl flex items-center justify-center border border-zinc-100 group-hover:bg-red-50 transition-colors duration-500">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-3 text-zinc-800 tracking-tight">{title}</h3>
      <p className="text-zinc-500 font-medium leading-relaxed">{description}</p>
    </motion.div>
  );
}
