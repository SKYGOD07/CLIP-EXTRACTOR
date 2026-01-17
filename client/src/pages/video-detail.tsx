import { useRoute } from "wouter";
import { useVideo, useRestartProcessing } from "@/hooks/use-videos";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { Loader2, PlayCircle, RefreshCw, AlertTriangle } from "lucide-react";
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
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <h2 className="text-xl font-bold">Error loading video</h2>
        <p className="text-muted-foreground">The video could not be found or there was a server error.</p>
      </div>
    );
  }

  const transcript = video.transcript as TranscriptSegment[] | null;

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight break-all">{video.originalName}</h1>
          <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
            <span>Uploaded {video.createdAt ? format(new Date(video.createdAt), "MMM d, yyyy") : ""}</span>
            <Separator orientation="vertical" className="h-4" />
            <StatusBadge status={video.status} />
          </div>
        </div>
        {(video.status === "error" || video.status === "complete") && (
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => restartProcessing(video.id)}
            disabled={isRestarting}
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${isRestarting ? "animate-spin" : ""}`} />
            Reprocess Video
          </Button>
        )}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Clips (occupies 2/3 width) */}
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold">Generated Clips</h2>
          
          {video.clips && video.clips.length > 0 ? (
            <div className="grid gap-6">
              {video.clips.map((clip) => (
                <Card key={clip.id} className="overflow-hidden">
                  <div className="aspect-video bg-black relative group">
                    <video 
                      src={clip.url} 
                      controls 
                      className="w-full h-full object-contain"
                      poster="/images/video-placeholder.png"
                    />
                  </div>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start gap-4 mb-2">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                            {formatTime(clip.startTime)} - {formatTime(clip.endTime)}
                          </span>
                          {clip.viralityScore && (
                            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded border border-emerald-100">
                              Score: {clip.viralityScore.toFixed(1)}/100
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium leading-relaxed">{clip.summary || "No summary available"}</p>
                      </div>
                      <Button size="icon" variant="ghost" className="shrink-0" asChild>
                        <a href={clip.url} download target="_blank" rel="noopener noreferrer">
                          <PlayCircle className="h-5 w-5" />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="py-12 text-center">
                {video.status === "complete" ? (
                  <p className="text-muted-foreground">No clips were generated. Try reprocessing.</p>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader2 className="h-8 w-8 animate-spin text-primary/50" />
                    <p>Processing video to extract clips...</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Transcript & Metadata (occupies 1/3 width) */}
        <div className="space-y-6">
          <Card className="h-[600px] flex flex-col">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Transcript</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              {transcript && transcript.length > 0 ? (
                <ScrollArea className="h-full pr-4">
                  <div className="space-y-4 text-sm leading-relaxed text-muted-foreground">
                    {transcript.map((segment, i) => (
                      <div key={i} className="hover:bg-muted/50 p-2 rounded transition-colors">
                        <span className="text-xs font-mono text-primary/50 block mb-1">
                          {formatTime(segment.start)}
                        </span>
                        <p>{segment.text}</p>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                  {video.status === "complete" ? "No transcript available" : "Waiting for transcription..."}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-32" />
        </div>
        <Skeleton className="h-9 w-24" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-96 w-full rounded-lg" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-[600px] w-full rounded-lg" />
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
