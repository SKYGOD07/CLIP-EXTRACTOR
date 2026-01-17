import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useLocation } from "wouter";
import { Upload as UploadIcon, FileVideo, Loader2 } from "lucide-react";
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

      if (file.size > 500 * 1024 * 1024) { // 500MB limit for demo
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
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Upload Video</h1>
        <p className="text-muted-foreground mt-2">
          Upload a long-form video to automatically extract high-value clips.
        </p>
      </div>

      <Card className="border-dashed border-2">
        <CardContent className="p-0">
          <div
            {...getRootProps()}
            className={`
              flex flex-col items-center justify-center py-24 px-4 text-center cursor-pointer transition-colors
              ${isDragActive ? "bg-muted/50" : "hover:bg-muted/20"}
              ${isPending ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input {...getInputProps()} />
            
            {isPending ? (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <div className="space-y-1">
                  <p className="text-lg font-medium">Uploading video...</p>
                  <p className="text-sm text-muted-foreground">Please keep this page open.</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="p-4 rounded-full bg-primary/5 text-primary">
                  <UploadIcon className="h-8 w-8" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-medium">
                    {isDragActive ? "Drop the video here" : "Drag & drop video here"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    or click to browse files (MP4, MOV, AVI)
                  </p>
                </div>
                <Button variant="secondary" className="mt-2">
                  <FileVideo className="mr-2 h-4 w-4" />
                  Select Video
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard 
          title="Smart Analysis" 
          description="AI analyzes transcript and visuals to find engaging moments."
        />
        <FeatureCard 
          title="Viral Scoring" 
          description="Each clip gets a predicted virality score based on content."
        />
        <FeatureCard 
          title="Auto-Clipping" 
          description="Get ready-to-share clips perfectly trimmed for social media."
        />
      </div>
    </div>
  );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
  return (
    <div className="bg-card rounded-lg p-6 border shadow-sm">
      <h3 className="font-semibold mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
