import { useState, useEffect } from "react";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Copy, Check, ChevronRight, Terminal, Box, Code2, Cpu, Zap, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const CodeBlock = ({ code, title, language = "javascript" }: { code: string, title?: string, language?: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-8 rounded-xl overflow-hidden border border-primary/20 bg-background/50 backdrop-blur-md shadow-[0_0_30px_rgba(var(--primary),0.05)] relative group transition-all duration-300 hover:border-primary/40 hover:shadow-[0_0_40px_rgba(var(--primary),0.1)]">
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
      
      <div className="flex items-center justify-between px-4 py-2 bg-black/60 border-b border-primary/10">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4 text-primary/70" />
          <span className="text-xs font-mono text-muted-foreground">{title || language}</span>
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-8 w-8 text-muted-foreground hover:text-primary transition-colors"
          onClick={handleCopy}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        </Button>
      </div>
      
      <div className="p-4 overflow-x-auto relative">
        <pre className="text-sm font-mono text-blue-100/90 leading-relaxed min-w-full">
          <code>{code.trim()}</code>
        </pre>
      </div>
    </div>
  );
};

const Section = ({ id, icon: Icon, title, children }: { id: string, icon: any, title: string, children: React.ReactNode }) => {
  return (
    <motion.section 
      id={id}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="mb-24 relative scroll-mt-24"
    >
      <div className="flex items-center gap-3 mb-8 pb-4 border-b border-white/5">
        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center border border-primary/30 shadow-[0_0_15px_rgba(var(--primary),0.3)]">
          <Icon className="h-5 w-5 text-primary" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight text-white/90 drop-shadow-md">{title}</h2>
      </div>
      <div className="prose prose-invert max-w-none prose-p:text-muted-foreground prose-li:text-muted-foreground prose-strong:text-primary/90">
        {children}
      </div>
    </motion.section>
  );
};

export default function ThreeJsPresentationPage() {
  const [activeTab, setActiveTab] = useState("quick-start");

  // Navigation Items
  const navItems = [
    { id: "quick-start", label: "Quick Start", icon: Zap },
    { id: "animation-system", label: "System Overview", icon: Activity },
    { id: "animation-clip", label: "AnimationClip", icon: Box },
    { id: "animation-mixer", label: "AnimationMixer", icon: Cpu },
    { id: "animation-action", label: "AnimationAction", icon: Code2 }
  ];

  // Scroll spy to update active tab
  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + 150; // Offset for header

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section && section.offsetTop <= scrollPosition) {
          setActiveTab(navItems[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#030014] text-gray-200 selection:bg-primary/40 font-sans">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[150px]" />
        <div className="absolute top-[40%] right-[-20%] w-[60%] h-[60%] rounded-full bg-purple-600/10 blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-600/10 blur-[120px]" />
        {/* Subtle noise texture */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E")' }}></div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-[#030014]/80 backdrop-blur-xl">
        <div className="container mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center gap-2 cursor-pointer group">
              <Box className="h-6 w-6 text-primary group-hover:scale-110 transition-transform" />
              <span className="text-lg font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">VoxClip AI <span className="text-primary">Docs</span></span>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/app">
              <Button size="sm" variant="outline" className="rounded-full border-primary/20 hover:bg-primary/10 hover:border-primary/50 transition-colors">
                Back to App
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-12 flex gap-12 relative z-10">
        
        {/* Sidebar TOC */}
        <aside className="w-64 hidden lg:block flex-shrink-0 relative">
          <div className="sticky top-28 p-6 rounded-2xl border border-white/5 bg-white/[0.02] backdrop-blur-md">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-6">Contents</h3>
            <nav className="flex flex-col gap-2">
              {navItems.map((item) => (
                <a 
                  key={item.id}
                  href={`#${item.id}`}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-300 ${activeTab === item.id ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-white hover:bg-white/5'}`}
                >
                  <item.icon className={`h-4 w-4 ${activeTab === item.id ? 'opacity-100' : 'opacity-50'}`} />
                  {item.label}
                  {activeTab === item.id && (
                    <motion.div layoutId="activeDot" className="h-1.5 w-1.5 rounded-full bg-primary ml-auto" />
                  )}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 max-w-4xl pt-8 pb-32">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-20"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
              <Box className="h-4 w-4" />
              <span>Developer Reference</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
              Three.js <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-400 to-blue-500">Animation</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl">
              A comprehensive guide to leveraging the powerful animation system within Three.js to build dynamic, responsive 3D experiences.
            </p>
          </motion.div>

          <Section id="quick-start" title="Quick Start" icon={Zap}>
            <p className="text-lg mb-6">Implement a simple procedural animation loop using the Three.js Clock.</p>
            <CodeBlock 
              title="animation-loop.js"
              code={`import * as THREE from "three";

// Simple procedural animation
const clock = new THREE.Clock();

function animate() {
  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  mesh.rotation.y += delta;
  mesh.position.y = Math.sin(elapsed) * 0.5;

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();`} 
            />
          </Section>

          <Section id="animation-system" title="System Overview" icon={Activity}>
            <p className="text-lg mb-6">The Three.js animation system is composed of three interconnected primary components working in tandem:</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-8">
              {[
                { title: "AnimationClip", desc: "Container holding reusable keyframe data for specific animations.", icon: Box },
                { title: "AnimationMixer", desc: "The core engine that plays and blends animations on a root object.", icon: Cpu },
                { title: "AnimationAction", desc: "Controller managing the playback status of a specific clip through a mixer.", icon: Code2 }
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                  <item.icon className="h-8 w-8 text-primary mb-4" />
                  <h4 className="font-semibold text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section id="animation-clip" title="AnimationClip & Tracks" icon={Box}>
            <p className="text-lg mb-6">Stores keyframe animation data across specific timeframes. You combine multiple keyframe tracks to build complex clips.</p>
            
            <CodeBlock 
              title="create-clip.js"
              code={`// Create animation clip
const times = [0, 1, 2]; // Keyframe times (seconds)
const values = [0, 1, 0]; // Values at each keyframe

const track = new THREE.NumberKeyframeTrack(
  ".position[y]", // Property path
  times,
  values,
);

const clip = new THREE.AnimationClip("bounce", 2, [track]);`} 
            />

            <h3 className="text-2xl font-semibold mt-12 mb-6 text-white/90">Common Track Types</h3>
            <p className="mb-6">Three.js provides specific track types optimized for different data structures.</p>
            
            <CodeBlock 
              title="track-types.js"
              code={`// Number track (single value)
new THREE.NumberKeyframeTrack(".material.opacity", times, [1, 0]);

// Vector track (position, scale) - x,y,z for each time
new THREE.VectorKeyframeTrack(".position", times, [
  0, 0, 0,  // t=0
  1, 2, 0,  // t=1
  0, 0, 0,  // t=2
]);

// Quaternion track (rotation)
const q1 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, 0, 0));
const q2 = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI, 0));
new THREE.QuaternionKeyframeTrack(
  ".quaternion",
  [0, 1],
  [q1.x, q1.y, q1.z, q1.w, q2.x, q2.y, q2.z, q2.w]
);

// Boolean track
new THREE.BooleanKeyframeTrack(".visible", [0, 0.5, 1], [true, false, true]);`} 
            />
          </Section>

          <Section id="animation-mixer" title="AnimationMixer" icon={Cpu}>
            <p className="text-lg mb-6">The mixer binds animations to a specific 3D model and its descendants. The mixer <strong>must be updated</strong> inside your animation loop.</p>
            
            <CodeBlock 
              title="mixer-setup.js"
              code={`const mixer = new THREE.AnimationMixer(model);

// Create action from clip
const action = mixer.clipAction(clip);
action.play();

// Update in animation loop
function animate() {
  const delta = clock.getDelta();
  
  // CRITICAL: Update the mixer with the time delta
  mixer.update(delta); 

  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}`} 
            />
          </Section>

          <Section id="animation-action" title="AnimationAction" icon={Code2}>
            <p className="text-lg mb-6">Controls fine-grained playback details for a specific clip, such as looping, blending, fading, and time scaling.</p>
            
            <CodeBlock 
              title="action-controls.js"
              code={`const action = mixer.clipAction(clip);

// Playback control
action.play();
action.stop();
action.reset();

// Time control
action.timeScale = 1;     // Playback speed (negative = reverse)
action.paused = false;

// Loop modes
action.loop = THREE.LoopRepeat;     // Default: loop forever
action.loop = THREE.LoopOnce;       // Play once and stop
action.loop = THREE.LoopPingPong;   // Alternate forward/backward

// Fade In/Out
action.reset().fadeIn(0.5).play();

// Crossfade between animations
const action1 = mixer.clipAction(clip1);
const action2 = mixer.clipAction(clip2);

action1.play();
// Later, elegantly crossfade to action2 over 0.5 seconds
action1.crossFadeTo(action2, 0.5, true);
action2.play();`} 
            />
          </Section>

          <div className="mt-32 p-8 rounded-2xl bg-gradient-to-br from-primary/20 to-purple-600/20 border border-primary/30 text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl" />
            <SparklesIcon className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-2xl font-bold mb-4 text-white">Ready to elevate your project?</h3>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              This interactive presentation is part of VoxClip AI's exceptional UI toolkit. We believe in providing over-the-top, premium experiences.
            </p>
            <Link href="/">
              <Button className="rounded-full px-8 shadow-[0_0_30px_rgba(var(--primary),0.5)]">
                Back to VoxClip AI Home
              </Button>
            </Link>
          </div>

        </main>
      </div>
    </div>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}
