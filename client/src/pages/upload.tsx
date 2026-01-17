import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useLocation } from "wouter";
import { Upload as UploadIcon, FileVideo, Loader2, Sparkles, Zap, Scissors } from "lucide-react";
import { useUploadVideo } from "@/hooks/use-videos";
import { useToast } from "@/hooks/use-toast";
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
            title: "Upload started",
            description: "Your video is being processed.",
          });
          setLocation(`/videos/${video.id}`);
        },
        onError: (error) => {
          toast({
            title: "Upload failed",
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
    accept: {
      "video/*": [".mp4", ".mov", ".avi", ".webm"],
    },
    maxFiles: 1,
    disabled: isPending,
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Hero Header */}
        <div className="text-center space-y-4">
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text float-animation">
            Upload Video
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Upload a long-form video to automatically extract high-value clips powered by AI
          </p>
        </div>

        {/* Upload Dropzone */}
        <div className="gradient-border">
          <div
            {...getRootProps()}
            className={`
              relative overflow-hidden rounded-xl transition-all duration-300
              ${isDragActive 
                ? "bg-blue-500/10 border-blue-500/50" 
                : "bg-slate-900/40 hover:bg-slate-900/60"
              }
              ${isPending ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
            `}
          >
            <input {...getInputProps()} />
            
            {/* Animated background effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-50" />
            
            <div className="relative flex flex-col items-center justify-center py-24 px-4 text-center">
              {isPending ? (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative">
                    <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl" />
                    <Loader2 className="h-16 w-16 animate-spin text-blue-400 relative z-10" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-white">Uploading video...</p>
                    <p className="text-sm text-slate-400">Please keep this page open</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
                    <div className="relative p-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 group-hover:border-blue-400/50 transition-all">
                      <UploadIcon className="h-12 w-12 text-blue-400" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-2xl font-semibold text-white">
                      {isDragActive ? "Drop the video here" : "Drag & drop video here"}
                    </p>
                    <p className="text-slate-400">
                      or click to browse files (MP4, MOV, AVI, WEBM)
                    </p>
                  </div>
                  
                  <Button 
                    variant="default" 
                    size="lg"
                    className="mt-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 text-white px-8 py-6 text-base font-medium neon-glow"
                  >
                    <FileVideo className="mr-2 h-5 w-5" />
                    Select Video File
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FeatureCard 
            icon={<Sparkles className="h-6 w-6" />}
            title="Smart Analysis" 
            description="AI analyzes transcript and visuals to find engaging moments that resonate with audiences."
            gradient="from-blue-500 to-cyan-500"
          />
          <FeatureCard 
            icon={<Zap className="h-6 w-6" />}
            title="Viral Scoring" 
            description="Each clip gets a predicted virality score based on content quality and engagement potential."
            gradient="from-purple-500 to-pink-500"
          />
          <FeatureCard 
            icon={<Scissors className="h-6 w-6" />}
            title="Auto-Clipping" 
            description="Get ready-to-share clips perfectly trimmed and optimized for social media platforms."
            gradient="from-orange-500 to-red-500"
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description,
  gradient 
}: { 
  icon: React.ReactNode;
  title: string; 
  description: string;
  gradient: string;
}) {
  return (
    <div className="glass-card rounded-xl p-6 card-lift group">
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-lg bg-gradient-to-br ${gradient} bg-opacity-10 group-hover:scale-110 transition-transform`}>
          <div className="text-white">
            {icon}
          </div>
        </div>
        <div className="flex-1 space-y-2">
          <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-400 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}