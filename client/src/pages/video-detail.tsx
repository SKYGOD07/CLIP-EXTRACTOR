import { useRoute } from "wouter";
import { useVideo, useRestartProcessing } from "@/hooks/use-videos";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Loader2, Download, RefreshCw, AlertTriangle, Sparkles } from "lucide-react";
import type { TranscriptSegment } from "@shared/schema";
import { Skeleton } from "@/components/ui/skeleton";

export default function VideoDetailPage() {
  const [, params] = useRoute("/videos/:id");
  const id = parseInt(params?.id || "0");
  const { data: video, isLoading, error } = useVideo(id);
  const { mutate: restartProcessing, isPending: isRestarting } = useRestartProcessing();

  if (isLoading) return <DetailSkeleton />;
  if (error || !video) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-2xl" />
          <AlertTriangle className="h-16 w-16 text-red-400 relative z-10" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Error loading video</h2>
        <p className="text-slate-400 max-w-md">The video could not be found or there was a server error.</p>
      </div>
    );
  }

  const transcript = video.transcript as TranscriptSegment[] | null;

  return (
    <div className="min-h-screen py-8 space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
        <div className="flex-1">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 break-words">{video.originalName}</h1>
          <div className="flex items-center gap-4 text-sm text-slate-400 flex-wrap">
            <span>Uploaded {video.createdAt ? format(new Date(video.createdAt), "MMM d, yyyy") : ""}</span>
            <Separator orientation="vertical" className="h-4 bg-slate-700" />
            <StatusBadge status={video.status} />
          </div>
        </div>
        {(video.status === "error" || video.status === "complete") && (
          <Button 
            variant="outline" 
            size="lg"
            onClick={() => restartProcessing(video.id)}
            disabled={isRestarting}
            className="glass-card border-blue-500/30 hover:border-blue-400/50 text-white"
          >
            <RefreshCw className={`mr-2 h-5 w-5 ${isRestarting ? "animate-spin" : ""}`} />
            Reprocess Video
          </Button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Clips (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="h-6 w-6 text-blue-400" />
            <h2 className="text-2xl font-semibold text-white">Generated Clips</h2>
          </div>
          
          {video.clips && video.clips.length > 0 ? (
            <div className="grid gap-6">
              {video.clips.map((clip) => (
                <div key={clip.id} className="glass-card rounded-xl overflow-hidden card-lift">
                  <div className="aspect-video bg-black relative group">
                    <video 
                      src={clip.url} 
                      controls 
                      className="w-full h-full object-contain"
                      poster="/images/video-placeholder.png"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  </div>
                  <CardContent className="p-6 bg-slate-900/40">
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-3 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs bg-blue-500/10 text-blue-300 px-3 py-1.5 rounded-full border border-blue-500/30">
                            {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
                          </span>
                          {clip.viralityScore && (
                            <span className="text-xs font-medium text-emerald-300 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Score: {clip.viralityScore.toFixed(1)}/100
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-slate-300 leading-relaxed">{clip.summary || "No summary available"}</p>
                      </div>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="shrink-0 hover:bg-blue-500/10 hover:text-blue-400" 
                        asChild
                      >
                        <a href={clip.url} download target="_blank" rel="noopener noreferrer">
                          <Download className="h-5 w-5" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </div>
              ))}
            </div>
          ) : (
            <div className="gradient-border rounded-xl">
              <div className="bg-slate-900/40 rounded-xl py-16 text-center">
                {video.status === "complete" ? (
                  <p className="text-slate-400">No clips were generated. Try reprocessing the video.</p>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-2xl" />
                      <Loader2 className="h-12 w-12 animate-spin text-blue-400 relative z-10" />
                    </div>
                    <p className="text-slate-300 text-lg">Processing video to extract clips...</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Transcript (1/3 width) */}
        <div className="space-y-6">
          <div className="glass-card rounded-xl h-[600px] flex flex-col overflow-hidden">
            <CardHeader className="pb-4 border-b border-slate-800/50">
              <CardTitle className="text-xl text-white">Transcript</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0 p-0">
              {transcript && transcript.length > 0 ? (
                <ScrollArea className="h-full px-6 py-4">
                  <div className="space-y-4 text-sm leading-relaxed">
                    {transcript.map((segment, i) => (
                      <div 
                        key={i} 
                        className="hover:bg-blue-500/5 p-3 rounded-lg transition-all cursor-pointer group"
                      >
                        <span className="text-xs font-mono text-blue-400/60 block mb-2 group-hover:text-blue-400">
                          {formatTime(segment.start)}
                        </span>
                        <p className="text-slate-300">{segment.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 text-sm px-6">
                  {video.status === "complete" ? "No transcript available" : "Waiting for transcription..."}
                </div>
              )}
            </CardContent>
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="min-h-screen py-8 space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <Skeleton className="h-10 w-80 bg-slate-800/50" />
          <Skeleton className="h-5 w-48 bg-slate-800/50" />
        </div>
        <Skeleton className="h-12 w-40 bg-slate-800/50 rounded-lg" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-8 w-56 bg-slate-800/50" />
          <Skeleton className="h-96 w-full rounded-xl bg-slate-800/50" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[600px] w-full rounded-xl bg-slate-800/50" />
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}