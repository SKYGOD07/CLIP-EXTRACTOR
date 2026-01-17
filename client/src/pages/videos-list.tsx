import { Link } from "wouter";
import { useVideos } from "@/hooks/use-videos";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Upload, ChevronRight, Video as VideoIcon, Play } from "lucide-react";

export default function VideosListPage() {
  const { data: videos, isLoading } = useVideos();

  if (isLoading) return <ListSkeleton />;

  return (
    <div className="min-h-screen py-8 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-5xl md:text-6xl font-bold tracking-tight gradient-text mb-3">
            My Videos
          </h1>
          <p className="text-lg text-slate-400">
            Manage and view your processed videos
          </p>
        </div>
        <Link href="/">
          <Button 
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 neon-glow px-6"
          >
            <Upload className="mr-2 h-5 w-5" />
            Upload New Video
          </Button>
        </Link>
      </div>

      {/* Videos Grid */}
      {videos && videos.length > 0 ? (
        <div className="grid gap-6">
          {videos.map((video) => (
            <Link key={video.id} href={`/videos/${video.id}`}>
              <div className="glass-card rounded-xl overflow-hidden card-lift group cursor-pointer">
                <div className="flex items-center p-6 gap-6">
                  {/* Thumbnail */}
                  <div className="relative h-24 w-40 bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg flex items-center justify-center shrink-0 overflow-hidden group-hover:scale-105 transition-transform">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10" />
                    <VideoIcon className="h-10 w-10 text-slate-600 relative z-10" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold truncate text-xl text-white group-hover:text-blue-400 transition-colors">
                        {video.originalName}
                      </h3>
                      <StatusBadge status={video.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-slate-400">
                      <span>{format(new Date(video.createdAt || ""), "MMM d, yyyy • h:mm a")}</span>
                      {video.viralityScore !== null && (
                        <span className="text-emerald-400 font-medium flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          Avg Score: {video.viralityScore.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <div className="shrink-0 text-slate-600 group-hover:text-blue-400 group-hover:translate-x-1 transition-all">
                    <ChevronRight className="h-6 w-6" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="gradient-border rounded-2xl">
          <div className="bg-slate-900/40 rounded-2xl p-16 text-center">
            <div className="inline-flex p-6 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6">
              <VideoIcon className="h-12 w-12 text-blue-400" />
            </div>
            <h3 className="text-2xl font-semibold text-white mb-3">No videos yet</h3>
            <p className="text-slate-400 mb-8 max-w-md mx-auto text-lg">
              Upload your first video to start generating high-value clips automatically with AI
            </p>
            <Link href="/">
              <Button 
                size="lg"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-0 neon-glow px-8"
              >
                <Upload className="mr-2 h-5 w-5" />
                Upload Your First Video
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="min-h-screen py-8 space-y-12">
      <div className="flex justify-between items-center">
        <div className="space-y-3">
          <Skeleton className="h-12 w-64 bg-slate-800/50" />
          <Skeleton className="h-6 w-48 bg-slate-800/50" />
        </div>
        <Skeleton className="h-12 w-48 bg-slate-800/50 rounded-lg" />
      </div>
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-36 w-full rounded-xl bg-slate-800/50" />
        ))}
      </div>
    </div>
  );
}