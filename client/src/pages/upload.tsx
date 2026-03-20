import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useLocation } from "wouter";
import { Upload as UploadIcon, FileVideo, Loader2, Sparkles, Zap, Scissors } from "lucide-react";
import { useUploadVideo } from "@/hooks/use-videos";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const [, setLocation] = useLocation();
  const { mutate: uploadVideo, isPending } = useUploadVideo();
  const { toast } = useToast();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (!file) return;

      if (file.size > 500 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a video smaller than 500MB.",
          variant: "destructive",
        });
        return;
      }

      uploadVideo(file, {
        onSuccess: (video) => {
          toast({
            title: "Transmission Secured",
            description: "Video stream initialized and processing.",
          });
          setLocation(`/videos/${video.id}`);
        },
        onError: (error) => {
          toast({
            title: "Link Severed",
            description: error.message,
            variant: "destructive",
          });
        },
      });
    },
    [uploadVideo, setLocation, toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "video/*": [".mp4", ".mov", ".avi", ".webm"] },
    maxFiles: 1,
    disabled: isPending,
  });

  return (
    <div className="min-h-screen bg-black py-20 px-4 overflow-hidden relative">
      <div className="absolute inset-0 bg-[#030014] z-0" />
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_0%,rgba(16,185,129,0.05)_0%,transparent_50%)]" />
      
      <div className="max-w-6xl mx-auto space-y-20 relative z-10">
        {/* Cinematic Header */}
        <div className="text-center space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-center gap-2 text-emerald-400 text-xs font-bold tracking-[0.4em] uppercase"
          >
            <span className="w-12 h-[1px] bg-emerald-500/30"></span>
            Ingestion Station
            <span className="w-12 h-[1px] bg-emerald-500/30"></span>
          </motion.div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter text-white leading-none">
            UPLOAD <span className="text-zinc-600 italic">COLOSSUS</span>
          </h1>
          <p className="text-xl text-zinc-500 max-w-2xl mx-auto font-light leading-relaxed">
            Feed your high-resolution footage into our agentic pipeline. Supported up to 500MB via Cloud Protocol.
          </p>
        </div>

        {/* Premium Dropzone */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative group p-1 rounded-[3rem] bg-gradient-to-br from-white/10 to-transparent border border-white/5 shadow-3xl"
        >
          <div
            {...getRootProps()}
            className={`
              relative overflow-hidden rounded-[2.8rem] transition-all duration-700
              ${isDragActive ? "bg-emerald-500/5" : "bg-zinc-950/80 backdrop-blur-3xl"}
              ${isPending ? "cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <input {...getInputProps()} />
            
            <div className="relative flex flex-col items-center justify-center py-32 px-8 text-center min-h-[500px]">
               {isPending ? (
                 <div className="space-y-12 w-full max-w-sm">
                    <div className="relative">
                       <motion.div 
                         animate={{ rotate: 360 }}
                         transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                         className="w-32 h-32 rounded-full border border-dashed border-emerald-500/40 relative z-10 flex items-center justify-center"
                       >
                          <Loader2 className="h-12 w-12 animate-spin text-emerald-400" />
                       </motion.div>
                       <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-3xl animate-pulse" />
                    </div>
                    <div className="space-y-4">
                       <h3 className="text-2xl font-bold text-white uppercase italic tracking-widest">Streaming to Cloud...</h3>
                       <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ x: "-100%" }}
                            animate={{ x: "100%" }}
                            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                            className="h-full w-1/3 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,1)]"
                          />
                       </div>
                    </div>
                 </div>
               ) : (
                 <div className="space-y-10 group/drop">
                    <div className="relative mx-auto w-32 h-32 flex items-center justify-center">
                       <div className="absolute inset-0 bg-emerald-500/20 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                       <div className="relative w-full h-full rounded-full border border-white/10 bg-white/5 flex items-center justify-center group-hover:scale-110 group-hover:border-emerald-500/30 transition-all duration-700">
                          <UploadIcon className="h-12 w-12 text-zinc-400 group-hover:text-emerald-400 transition-colors" />
                       </div>
                    </div>
                    
                    <div className="space-y-2">
                       <p className="text-3xl font-bold text-white tracking-tight uppercase">
                          {isDragActive ? "Release File" : "Drop the Master"}
                       </p>
                       <p className="text-zinc-500 text-sm font-mono tracking-widest">
                          OR CLICK TO BROWSE LOCAL VOLUMES
                       </p>
                    </div>
                    
                    <Button 
                      className="h-16 px-12 rounded-full bg-white text-black font-black uppercase text-sm tracking-widest hover:bg-emerald-400 hover:scale-105 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
                    >
                      Initialize Upload
                    </Button>
                 </div>
               )}
            </div>
          </div>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { icon: Sparkles, title: "Multimodal Analysis", desc: "Agentic frame processing for superior results." },
            { icon: Zap, title: "Velocity Caching", desc: "Instant retrieval from Google Cloud Edge." },
            { icon: Scissors, title: "Zero-Loss Trimming", desc: "Precision cutting without re-encoding quality loss." }
          ].map((feat, i) => (
             <div key={i} className="p-8 rounded-[2rem] bg-zinc-900/50 border border-white/5 group hover:border-emerald-500/20 transition-all">
                <feat.icon className="h-8 w-8 text-zinc-600 mb-6 group-hover:text-emerald-400 transition-colors" />
                <h4 className="text-xl font-bold text-white mb-2 uppercase italic">{feat.title}</h4>
                <p className="text-zinc-500 text-sm leading-relaxed">{feat.desc}</p>
             </div>
          ))}
        </div>
      </div>
    </div>
  );
}