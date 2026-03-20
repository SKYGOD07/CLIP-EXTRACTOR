import { useState } from "react";
import { Link } from "wouter";
import { 
  Mic, Sparkles, AudioLines, Scissors, Wand2, Zap, 
  ArrowRight, Play, Activity, CheckCircle2,
  ChevronDown, Plus, ExternalLink, Copy
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { threeJsPrompt } from "@/lib/prompts";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CinematicCameraHero } from "@/components/cinematic-camera-hero";
import { VoiceAIEditingSection } from "@/components/voice-ai-section";

// Helper Components
const GlassStatCard = ({ metric, description }: { metric: string, description: string }) => (
  <div className="glass-panel w-72 p-5 rounded-2xl flex flex-col gap-2">
    <div className="text-3xl font-bold text-white">{metric}</div>
    <div className="text-sm text-white/60">{description}</div>
  </div>
);

const InteractiveActionButton = ({ children }: { children: React.ReactNode }) => (
  <motion.button 
    whileHover={{ scale: 1.05 }}
    className="group bg-white rounded-full pl-6 pr-2 py-2 flex items-center justify-between w-full mt-4 transition-all"
  >
    <span className="font-medium text-zinc-900">{children}</span>
    <div className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center group-hover:bg-zinc-700 transition-colors">
      <ArrowRight className="text-white w-5 h-5" />
    </div>
  </motion.button>
);

const ShowcaseGallery = () => {
  const demos = [
    {
      category: "Animation",
      title: "Abstract Flow",
      description: "Procedural 3D blob with dynamic vertex shaders and neon emission.",
      image: "/prompt-1.png",
      prompt: threeJsPrompt
    },
    {
      category: "Character",
      title: "Cyber Hippo",
      description: "Skeletal rigged character with PBR materials and reactive animations.",
      image: "/prompt-2.png",
      prompt: threeJsPrompt
    }
  ];

  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section className="relative py-24 px-4 overflow-hidden">
      <div className="max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold tracking-[0.3em] uppercase">
              <span className="w-10 h-[1px] bg-emerald-500/50"></span>
              Showcase
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.1]">
              Exceptional <span className="text-zinc-500 italic">Prompts</span><br />
              for the Presentation
            </h2>
          </div>
          <div className="flex gap-2">
            {demos.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-2 h-2 rounded-full transition-all duration-500 ${activeIndex === i ? 'bg-emerald-400 w-10' : 'bg-white/10 hover:bg-white/20'}`}
              />
            ))}
          </div>
        </div>

        <div className="relative isolate">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeIndex}
              initial={{ opacity: 0, scale: 0.98, x: 20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 1.02, x: -20 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-[21/9] min-h-[450px] rounded-[48px] overflow-hidden border border-white/10 bg-zinc-950 shadow-[0_40px_100px_rgba(0,0,0,0.8)] group"
            >
              <img 
                src={demos[activeIndex].image} 
                alt={demos[activeIndex].title}
                className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-[2000ms] ease-out"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
              
              {/* Card Decoration */}
              <div className="absolute top-12 left-12 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-widest text-white/40 uppercase">Rendering</span>
                  <span className="text-xs font-mono text-emerald-400">WebGL 2.0 / PBR</span>
                </div>
              </div>

              {/* Main Content Overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-10">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-bold tracking-widest uppercase">
                      {demos[activeIndex].category}
                    </div>
                    <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight drop-shadow-2xl uppercase">
                      {demos[activeIndex].title}
                    </h3>
                    <p className="text-lg text-white/50 font-light leading-relaxed">
                      {demos[activeIndex].description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <motion.button 
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="h-16 px-8 rounded-3xl bg-white text-black font-bold flex items-center gap-4 transition-all hover:bg-zinc-200 shadow-[0_0_40px_rgba(255,255,255,0.2)]"
                        >
                          <Plus className="h-5 w-5 stroke-[3]" />
                          <span className="text-sm">Use prompt</span>
                          <ChevronDown className="h-4 w-4 opacity-40 ml-2" />
                        </motion.button>
                      </DialogTrigger>
                      <DialogContent className="max-w-4xl max-h-[85vh] overflow-hidden bg-zinc-950 border-white/10 p-0 rounded-[40px] shadow-3xl">
                        <div className="flex flex-col h-full">
                          <div className="p-8 border-b border-white/5 flex items-center justify-between">
                            <DialogTitle className="text-2xl font-bold tracking-tight text-white uppercase italic">Prompt Source Code</DialogTitle>
                            <Button 
                              variant="ghost"
                              className="h-12 px-6 rounded-2xl bg-white/5 hover:bg-white/10 text-white gap-2"
                              onClick={() => {
                                navigator.clipboard.writeText(demos[activeIndex].prompt);
                              }}
                            >
                              <Copy className="h-4 w-4" /> Copy Protocol
                            </Button>
                          </div>
                          <div className="flex-1 overflow-y-auto p-12 custom-scrollbar">
                            <pre className="font-mono text-xs md:text-sm text-zinc-400 leading-relaxed whitespace-pre-wrap">
                              <code>{demos[activeIndex].prompt}</code>
                            </pre>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    
                    <Link href="/threejs">
                      <motion.button
                        whileHover={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                        className="h-16 px-8 rounded-3xl bg-white/5 border border-white/10 text-white font-medium text-sm flex items-center gap-3 backdrop-blur-xl transition-all"
                      >
                        Docs <ExternalLink className="h-4 w-4 opacity-50" />
                      </motion.button>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Visual Accents */}
              <div className="absolute inset-0 border-[24px] border-black/10 pointer-events-none rounded-[48px]" />
              <div className="absolute top-1/2 left-0 w-1 h-32 bg-emerald-500/40 -translate-y-1/2" />
              <div className="absolute top-1/2 right-0 w-1 h-32 bg-zinc-500/40 -translate-y-1/2" />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-x-hidden font-sans">
      
      {/* Navigation */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
        <nav className="pointer-events-auto bg-white/5 backdrop-blur-[20px] rounded-full p-[1.5px] border border-white/10 flex items-center gap-1 shadow-2xl">
          <div className="px-6 py-2 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center">
              <Zap className="w-3 h-3 text-black" />
            </div>
            <span className="font-bold text-white tracking-tight">VXC AI</span>
          </div>
          
          <div className="hidden md:flex items-center px-4 gap-1">
            {['Features', 'How it Works', 'Pricing'].map((item) => (
              <a key={item} href={`#${item.toLowerCase().replace(/ /g, '-')}`} className="px-4 py-2 rounded-full text-sm font-medium text-white/80 hover:text-white hover:bg-white/10 transition-colors">
                {item}
              </a>
            ))}
          </div>

          <div className="pr-2 pl-4 py-1 flex items-center">
            <Link href="/app">
              <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-bold hover:scale-105 transition-transform">
                Get Started
              </button>
            </Link>
          </div>
        </nav>
      </div>

      <main className="max-w-[1600px] mx-auto w-full pt-4 pb-24 space-y-32">
        
        {/* CINEMATIC HERO & 3D CAMERA EXPERIENCE */}
        <CinematicCameraHero />

        {/* PROMPT SHOWCASE GALLERY */}
        <ShowcaseGallery />

        {/* VOICE AI EDITING SECTION */}
        <VoiceAIEditingSection />

        {/* FEATURE GRID */}
        <section id="features" className="container mx-auto px-4 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">
            {/* Left Column Strategy */}
            <div className="lg:w-1/3 flex flex-col">
              <div className="sticky top-32">
                <div className="text-[10px] font-bold tracking-[0.2em] text-zinc-500 uppercase mb-4">Capabilities</div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">System Output</h2>
                
                <div className="grid grid-cols-2 gap-x-8 gap-y-12">
                  {[
                    { icon: Mic, label: "Voice Control" },
                    { icon: Sparkles, label: "Auto Highlights" },
                    { icon: AudioLines, label: "Silence Trimmer" },
                    { icon: Scissors, label: "Smart Cut" },
                    { icon: Wand2, label: "Real-Time" },
                    { icon: Activity, label: "Context AI" }
                  ].map((feat, i) => (
                    <div key={i} className="flex flex-col gap-3 group">
                      <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:border-emerald-500/50 transition-colors">
                        <feat.icon className="w-5 h-5 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                      </div>
                      <span className="font-medium text-sm text-zinc-300">{feat.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column Strategy */}
            <div className="lg:w-2/3">
              <div className="glass-panel p-2 rounded-[40px] overflow-hidden relative group">
                <img 
                  src="https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?q=80&w=2574&auto=format&fit=crop" 
                  alt="System Abstract" 
                  className="w-full h-[600px] object-cover rounded-[32px] group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                
                {/* Floating Analysis Component */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[85%] max-w-md">
                  <div className="glass-panel rounded-3xl p-6 shadow-2xl backdrop-blur-xl bg-black/40 border-white/20">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                        <span className="text-xs font-bold tracking-widest text-white/80 uppercase">Analysis Active</span>
                      </div>
                      <span className="text-xs font-mono text-emerald-400">98.2% confidence</span>
                    </div>
                    
                    <div className="space-y-4">
                      {[ 
                        { label: "Speech Intent", val: "94%" },
                        { label: "Emotional Resonance", val: "88%" },
                        { label: "Visual Context", val: "99%" }
                      ].map((item, i) => (
                        <div key={i} className="space-y-2">
                          <div className="flex justify-between text-xs text-white/70">
                            <span>{item.label}</span>
                            <span className="font-mono">{item.val}</span>
                          </div>
                          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 rounded-full" style={{ width: item.val }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* DARK PRODUCTIVITY BLOCK */}
        <section id="how-it-works" className="w-[100vw] relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] bg-[#18181B] py-32 px-4 overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] z-0" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_80%)] z-0" />
          
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex flex-col lg:flex-row gap-16 items-center">
              
              {/* Left Steps */}
              <div className="lg:w-5/12 space-y-12">
                <div>
                  <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Flowing Pipeline</h2>
                  <p className="text-zinc-400 text-lg font-light">A seamless ingestion and processing pipeline designed to never interrupt your creative zone.</p>
                </div>
                
                <div className="space-y-6">
                  {[
                    { num: "01", title: "Ingestion & Sync", desc: "Upload a long video and give a natural voice command. Our proxy handles the streams." },
                    { num: "02", title: "Agentic Trim", desc: "Gemini processes speech intent, scores frames, and cuts the absolute best moments." }
                  ].map((step) => (
                    <div key={step.num} className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl hover:bg-zinc-900 transition-colors">
                      <div className="text-emerald-400 font-mono text-xl mb-3">{step.num}</div>
                      <h4 className="text-xl font-semibold mb-2">{step.title}</h4>
                      <p className="text-zinc-500 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right 3D Mockup */}
              <div className="lg:w-7/12 relative perspective-[2000px]">
                <div className="transform rotate-y-[-12deg] rotate-x-[5deg] rotate-z-[2deg] transition-transform duration-700 hover:rotate-0">
                  <div className="glass-panel p-2 rounded-[32px] bg-gradient-to-br from-zinc-800 to-zinc-950 border-zinc-800 shadow-[20px_20px_60px_rgba(0,0,0,0.5)]">
                    <div className="bg-[#0A0A0B] rounded-[24px] overflow-hidden border border-zinc-800 h-[500px] flex flex-col relative w-full">
                      
                      {/* Fake window header */}
                      <div className="h-12 border-b border-zinc-800 flex items-center px-4 gap-2 bg-[#121214]">
                        <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                        <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50" />
                        <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50" />
                        <div className="ml-4 text-xs font-mono text-zinc-500">voxclip-agent.ts</div>
                      </div>

                      {/* Fake code block */}
                      <div className="p-6 font-mono text-sm text-zinc-400 whitespace-pre leading-loose overflow-hidden">
                        <span className="text-pink-400">async function</span> <span className="text-blue-400">processCommand</span>(intent: Intent) {'{\n'}
                        {'  '}const stream = <span className="text-pink-400">await</span> ai.connect(intent);{'\n'}
                        {'  '}const highlights = <span className="text-pink-400">await</span> stream.extract();{'\n'}
                        {'\n'}
                        {'  '}<span className="text-pink-400">return</span> highlights.map(clip {'=>'} {'{\n'}
                        {'    '}<span className="text-pink-400">return</span> {'{\n'}
                        {'      '}...clip,{'\n'}
                        {'      '}score: clip.computeAesthetics(){'\n'}
                        {'    }'};{'\n'}
                        {'  }'});{'\n'}
                        {'}'}
                      </div>

                      {/* Bouncing Tag */}
                      <div className="absolute right-8 bottom-8 animate-bounce">
                        <div className="glass-panel px-4 py-2 rounded-full border-emerald-500/30 bg-emerald-500/10 text-emerald-400 text-sm font-medium flex items-center gap-2 shadow-[0_0_20px_rgba(52,211,153,0.1)]">
                          <CheckCircle2 className="w-4 h-4" />
                          Processing Complete
                        </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PRICING BENTO GRID */}
        <section id="pricing" className="bg-[#F4F4F5] rounded-[40px] p-8 lg:p-16 mb-24">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-zinc-900 mb-4">Start Creating</h2>
            <p className="text-zinc-500">Choose the perfect tier for your pipeline needs.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white rounded-[32px] border border-zinc-200 overflow-hidden flex flex-col transition-shadow hover:shadow-xl">
              <div className="h-32 bg-[url('https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=2000&auto=format&fit=crop')] bg-cover relative">
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
              </div>
              <div className="p-8 pt-0 flex-1 flex flex-col">
                <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">Hobbyist</div>
                <div className="text-4xl font-bold text-zinc-900 mb-6">$0<span className="text-lg text-zinc-400 font-normal">/mo</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  {['10 exports per month', '720p maximum resolution', 'Standard processing'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-600 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <InteractiveActionButton>Get Started</InteractiveActionButton>
              </div>
            </div>

            {/* Card 2 - Pro */}
            <div className="bg-white rounded-[32px] border border-emerald-200 overflow-hidden flex flex-col shadow-lg shadow-emerald-100 relative transition-shadow hover:shadow-2xl hover:shadow-emerald-200">
              <div className="absolute top-6 right-6 px-3 py-1 bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider rounded-full z-10">Popular</div>
              <div className="h-32 bg-[url('https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2000&auto=format&fit=crop')] bg-cover relative">
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
              </div>
              <div className="p-8 pt-0 flex-1 flex flex-col">
                <div className="text-emerald-500 font-bold text-xs uppercase tracking-widest mb-2">Creator</div>
                <div className="text-4xl font-bold text-zinc-900 mb-6">$19<span className="text-lg text-zinc-400 font-normal">/mo</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  {['Unlimited exports', '4K resolution', 'Priority processing pipeline', 'Custom watermarks'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-600 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <div className="group bg-emerald-400 rounded-full pl-6 pr-2 py-2 flex items-center justify-between w-full mt-4 cursor-pointer hover:scale-105 transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)]">
                  <span className="font-medium text-black">Start Free Trial</span>
                  <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center group-hover:bg-zinc-800 transition-colors">
                    <ArrowRight className="text-white w-5 h-5" />
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="bg-white rounded-[32px] border border-zinc-200 overflow-hidden flex flex-col transition-shadow hover:shadow-xl">
              <div className="h-32 bg-[url('https://images.unsplash.com/photo-1557682250-33bd709cbe85?q=80&w=2000&auto=format&fit=crop')] bg-cover relative">
                <div className="absolute inset-0 bg-gradient-to-t from-white to-transparent" />
              </div>
              <div className="p-8 pt-0 flex-1 flex flex-col">
                <div className="text-zinc-500 font-bold text-xs uppercase tracking-widest mb-2">Agency</div>
                <div className="text-4xl font-bold text-zinc-900 mb-6">$99<span className="text-lg text-zinc-400 font-normal">/mo</span></div>
                <ul className="space-y-3 mb-8 flex-1">
                  {['Team collaboration', 'API Access', 'Dedicated account manager', 'SLA guarantees'].map((feat, i) => (
                    <li key={i} className="flex items-center gap-3 text-zinc-600 text-sm">
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-300" />
                      {feat}
                    </li>
                  ))}
                </ul>
                <InteractiveActionButton>Contact Sales</InteractiveActionButton>
              </div>
            </div>

          </div>
        </section>

      </main>

      {/* Footer Minimalist */}
      <footer className="border-t border-white/5 bg-black py-12 text-center text-zinc-600 text-sm">
        <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center">
              <Zap className="w-3 h-3 text-zinc-500" />
            </div>
            <span className="font-bold tracking-tight text-zinc-400">VXC AI</span>
        </div>
        <p>© 2026 VoxClip AI. A generative experiment.</p>
      </footer>

    </div>
  );
}
