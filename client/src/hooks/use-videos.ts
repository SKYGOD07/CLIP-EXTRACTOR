import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { VideoResponse, VideosListResponse } from "@shared/schema";

// GET /api/videos
export function useVideos() {
  return useQuery({
    queryKey: [api.videos.list.path],
    queryFn: async () => {
      const res = await fetch(api.videos.list.path);
      if (!res.ok) throw new Error("Failed to fetch videos");
      return await res.json() as VideosListResponse;
    },
  });
}

// GET /api/videos/:id
export function useVideo(id: number) {
  return useQuery({
    queryKey: [api.videos.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.videos.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch video details");
      return await res.json() as VideoResponse;
    },
    // Poll every 2 seconds if status is processing
    refetchInterval: (data) => {
      if (!data) return false;
      const processing = ["uploaded", "transcribing", "analyzing"].includes(data.status);
      return processing ? 2000 : false;
    },
  });
}

// POST /api/videos/upload
export function useUploadVideo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("video", file);

      const res = await fetch(api.videos.process.path, {
        method: api.videos.process.method,
        body: formData,
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to upload video");
      }
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.videos.list.path] });
    },
  });
}

// POST /api/videos/:id/process
export function useRestartProcessing() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.videos.restart.path, { id });
      const res = await fetch(url, {
        method: api.videos.restart.method,
      });
      if (!res.ok) throw new Error("Failed to restart processing");
      return await res.json();
    },
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [api.videos.get.path, id] });
      queryClient.invalidateQueries({ queryKey: [api.videos.list.path] });
    },
  });
}
