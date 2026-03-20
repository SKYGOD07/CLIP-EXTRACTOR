import React from 'react';
import { motion } from 'framer-motion';
import { Mic, Scissors, Sparkles, MessageSquareCode } from 'lucide-react';

export const VoiceAIEditingSection = () => {
  return (
    <section className="py-32 px-4 relative overflow-hidden bg-black">
      <div className="max-w-[1400px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        {/* Left: Illustration & Visuals */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative aspect-square lg:aspect-auto lg:h-[700px] rounded-[3rem] overflow-hidden border border-white/5 bg-zinc-950 flex items-end justify-center group"
        >
          <img 
            src="/human-mic.png" 
            alt="Human with Microphone" 
            className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[3000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
          
          {/* Audio Wave Overlays */}
          <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex items-end gap-1 px-8 py-6 rounded-3xl bg-black/40 backdrop-blur-xl border border-white/10 shadow-2xl">
             {[0.4, 0.7, 1, 0.6, 0.8, 0.5, 0.9, 0.4, 0.7, 1].map((h, i) => (
               <motion.div 
                 key={i}
                 animate={{ scaleY: [1, h * 1.5, 1], opacity: [0.5, 1, 0.5] }}
                 transition={{ duration: 1 + Math.random(), repeat: Infinity }}
                 className="w-1.5 h-12 bg-emerald-500 rounded-full origin-bottom"
               />
             ))}
          </div>

          <div className="absolute top-12 left-12 space-y-2">
             <div className="text-[10px] font-bold tracking-[0.3em] text-emerald-400 uppercase">Input Stream</div>
             <p className="text-sm font-mono text-white/50">48kHz / 32-bit Floating Point</p>
          </div>
        </motion.div>

        {/* Right: Explanation & Interactivity */}
        <div className="space-y-12">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-widest uppercase">
              <Sparkles className="w-3 h-3" />
              Agentic Workflow
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight text-white leading-[1.05]">
              Direction by <br/>
              <span className="text-zinc-500 italic">Conversation.</span>
            </h2>
            <p className="text-xl text-zinc-400 font-light max-w-lg leading-relaxed">
              VoxClip AI doesn't just "filter" - it listens, understands your creative intent, and performs complex multi-step edits in seconds.
            </p>
          </div>

          <div className="space-y-4">
             {[
               { icon: Mic, title: "Natural Language Intents", desc: "No more hotkeys. Tell the agent exactly what you want: 'Find the funny part about the cats'." },
               { icon: Scissors, title: "Precision-Frame Cutting", desc: "Our multimodal agent scores every frame for aesthetics and audio resonance." },
               { icon: MessageSquareCode, title: "Adaptive Refinement", desc: "Iterate on clips with follow-up commands like 'Make that cut a bit tighter'." }
             ].map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="p-6 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/20 transition-all group"
                >
                  <div className="flex gap-1">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-emerald-500/10 group-hover:scale-110 transition-all">
                       <item.icon className="w-5 h-5 text-white group-hover:text-emerald-400 transition-colors" />
                    </div>
                    <div className="pl-4">
                       <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                       <p className="text-zinc-500 text-sm leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                </motion.div>
             ))}
          </div>
        </div>
      </div>
    </section>
  );
};
