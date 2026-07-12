"use client";

import { motion } from "framer-motion";
import { Brain, Target, Zap, Clock, Activity, BookOpen, Trophy, Hexagon } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 p-6 md:p-12 overflow-hidden relative font-sans">
      
      {/* High-Tech Background */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-30"
        style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, rgba(220, 38, 38, 0.15) 1px, transparent 0)`,
          backgroundSize: "32px 32px"
        }}
      />
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] bg-amber-400/10 rounded-full blur-[100px] pointer-events-none z-0" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[40%] bg-red-600/10 rounded-full blur-[100px] pointer-events-none z-0" />

      <motion.div 
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
          }
        }}
        className="max-w-7xl mx-auto space-y-10 relative z-10"
      >
        {/* Header */}
        <motion.div 
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
          }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-zinc-50/80 p-8 rounded-3xl border border-zinc-100 shadow-sm backdrop-blur-md"
        >
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-amber-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/20 text-white">
              <Hexagon className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-4xl font-black text-zinc-900 tracking-tight">
                Cruscotto <span className="text-red-600">Neurale</span>
              </h1>
              <p className="text-zinc-500 font-medium mt-1">Sincronizzazione dati: Attiva</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-white border border-zinc-200 px-6 py-3 rounded-2xl shadow-sm">
            <Trophy className="text-amber-500 w-6 h-6" />
            <div className="flex flex-col">
              <span className="font-bold text-zinc-800 leading-tight">Livello 12</span>
              <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">14.200 XP</span>
            </div>
          </div>
        </motion.div>

        {/* Top Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<Clock className="text-zinc-700" />} label="Ore di Studio" value="42h" />
          <StatCard icon={<BookOpen className="text-red-500" />} label="Nodi nel Grafo" value="156" />
          <StatCard icon={<Target className="text-amber-500" />} label="Precisione" value="88%" />
          <StatCard icon={<Zap className="text-red-600" />} label="Test Superati" value="24" />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Learning DNA Panel */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, scale: 0.95 },
              visible: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 200, damping: 20 } }
            }}
            className="lg:col-span-2 bg-white border border-zinc-100 rounded-3xl p-8 shadow-xl shadow-zinc-200/40 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-amber-400/5 rounded-full blur-3xl group-hover:bg-red-500/5 transition-colors duration-700" />
            
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-red-50 text-red-600 rounded-xl">
                <Brain className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-800 tracking-tight">Learning DNA</h2>
            </div>

            <div className="space-y-8 relative z-10">
              <div>
                <div className="flex justify-between text-sm mb-3 font-semibold text-zinc-600">
                  <span>Adattamento Stile</span>
                  <span className="text-red-600">Analitico / Visivo</span>
                </div>
                <div className="h-3 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
                  <motion.div initial={{ width: 0 }} animate={{ width: "75%" }} transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }} className="h-full bg-gradient-to-r from-amber-400 to-red-500" />
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm mb-3 font-semibold text-zinc-600">
                  <span>Ritenzione Sinaptica Stimata</span>
                  <span className="text-amber-600">Elevata (82%)</span>
                </div>
                <div className="h-3 bg-zinc-100 rounded-full overflow-hidden border border-zinc-200/50">
                  <motion.div initial={{ width: 0 }} animate={{ width: "82%" }} transition={{ duration: 1.5, delay: 0.7, ease: "easeOut" }} className="h-full bg-gradient-to-r from-amber-400 to-red-500" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 pt-8 border-t border-zinc-100">
                <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-400" />
                  <h3 className="text-zinc-800 text-sm font-bold uppercase tracking-widest mb-4">Vantaggi Rilevati</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge color="amber">Logica Matematica</Badge>
                    <Badge color="amber">Astrazione</Badge>
                  </div>
                </div>
                <div className="bg-zinc-50 border border-zinc-100 p-6 rounded-2xl relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-red-500" />
                  <h3 className="text-zinc-800 text-sm font-bold uppercase tracking-widest mb-4">Aree Critiche</h3>
                  <div className="flex flex-wrap gap-2">
                    <Badge color="red">Dati Cronologici</Badge>
                    <Badge color="red">Eccezioni alla regola</Badge>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Activity Timeline */}
          <motion.div 
            variants={{
              hidden: { opacity: 0, x: 20 },
              visible: { opacity: 1, x: 0, transition: { type: "spring", stiffness: 200, damping: 20 } }
            }}
            className="bg-white border border-zinc-100 rounded-3xl p-8 shadow-xl shadow-zinc-200/40"
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
                <Activity className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-zinc-800 tracking-tight">Registro Log</h2>
            </div>
            
            <div className="space-y-6 relative before:absolute before:inset-0 before:ml-2 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-red-500/50 before:to-transparent">
              <TimelineItem title="Test Feynman" desc="Concetto: Reti Neurali" time="Oggi" status="success" />
              <TimelineItem title="Integrazione Dati" desc="Manuale di Fisica Quantistica" time="Ieri" status="info" />
              <TimelineItem title="Interrogazione" desc="Voto: 8.5/10 - Prof. Mode" time="3g fa" status="warning" />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) {
  return (
    <motion.div 
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
      }}
      whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(220,38,38,0.1), 0 8px 10px -6px rgba(220,38,38,0.1)" }}
      className="bg-white border border-zinc-100 p-6 rounded-3xl flex items-center gap-5 shadow-sm transition-all duration-300"
    >
      <div className="w-14 h-14 bg-zinc-50 border border-zinc-100 rounded-2xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-3xl font-black text-zinc-800">{value}</p>
      </div>
    </motion.div>
  );
}

function Badge({ children, color }: { children: React.ReactNode, color: "amber" | "red" }) {
  const colorMap = {
    amber: "bg-amber-100 text-amber-800 border-amber-200",
    red: "bg-red-100 text-red-800 border-red-200",
  };
  return (
    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border shadow-sm ${colorMap[color]}`}>
      {children}
    </span>
  );
}

function TimelineItem({ title, desc, time, status }: { title: string, desc: string, time: string, status: "success" | "info" | "warning" }) {
  const statusColors = {
    success: "bg-amber-500 border-amber-200",
    info: "bg-zinc-800 border-zinc-300",
    warning: "bg-red-500 border-red-200"
  };

  return (
    <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
      <div className={`flex items-center justify-center w-5 h-5 rounded-full border-4 border-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-sm ${statusColors[status]}`} />
      <div className="w-[calc(100%-2.5rem)] md:w-[calc(50%-1.5rem)] bg-zinc-50 p-5 rounded-2xl border border-zinc-100 hover:border-red-200 transition-colors shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-bold text-zinc-800 text-sm">{title}</h4>
          <span className="text-xs font-bold text-red-500 bg-red-50 px-2 py-1 rounded-md">{time}</span>
        </div>
        <p className="text-sm font-medium text-zinc-500">{desc}</p>
      </div>
    </div>
  );
}
