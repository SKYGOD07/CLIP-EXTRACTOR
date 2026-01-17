import { Link } from "wouter";
import { useVideos } from "@/hooks/use-videos";
import { StatusBadge } from "@/components/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Upload, ChevronRight, Video as VideoIcon } from "lucide-react";

export default function VideosListPage() {
  const { data: videos, isLoading } = useVideos();

  if (isLoading) return <ListSkeleton />;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Videos</h1>
          <p className="text-muted-foreground mt-1">Manage and view your processed videos.</p>
        </div>
        <Link href="/">
          <Button>
            <Upload className="mr-2 h-4 w-4" />
            Upload New
          </Button>
        </Link>
      </div>

      {videos && videos.length > 0 ? (
        <div className="grid gap-4">
          {videos.map((video) => (
            <Link key={video.id} href={`/videos/${video.id}`} className="block group">
              <Card className="transition-all duration-200 hover:shadow-md hover:border-primary/50">
                <div className="flex items-center p-6 gap-6">
                  {/* Thumbnail / Icon */}
                  <div className="h-16 w-28 bg-muted rounded-md flex items-center justify-center shrink-0">
                    <VideoIcon className="h-8 w-8 text-muted-foreground/50" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold truncate text-lg group-hover:text-primary transition-colors">
                        {video.originalName}
                      </h3>
                      <StatusBadge status={video.status} />
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>{format(new Date(video.createdAt || ""), "MMM d, yyyy • h:mm a")}</span>
                      {video.viralityScore !== null && (
                        <span className="text-emerald-600 font-medium">
                          Avg Score: {video.viralityScore.toFixed(0)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0 text-muted-foreground group-hover:text-primary transition-colors">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="p-4 rounded-full bg-muted mb-4">
              <VideoIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No videos yet</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Upload your first video to start generating high-value clips automatically.
            </p>
            <Link href="/">
              <Button>Upload Video</Button>
            </Link>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}
