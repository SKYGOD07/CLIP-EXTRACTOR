import type { Express } from "express";
import { createServer, type Server } from "http";
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { storage } from "./storage";
import { transcribeAudio } from "./lib/transcribe";
import { analyzeTranscript } from "./lib/analyze";
import { extractAudio, cutClip } from "./lib/ffmpeg";
import { videos } from "@shared/schema";

const upload = multer({ dest: 'uploads/' });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // Ensure public/clips exists
  if (!fs.existsSync('client/public/clips')) {
    fs.mkdirSync('client/public/clips', { recursive: true });
  }

  app.get('/api/videos', async (req, res) => {
    const list = await storage.getVideos();
    res.json(list);
  });

  app.get('/api/videos/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    const video = await storage.getVideo(id);
    if (!video) return res.status(404).json({ message: 'Not found' });
    const clips = await storage.getClips(id);
    res.json({ ...video, clips });
  });

  app.post('/api/videos/upload', upload.single('video'), async (req, res) => {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    const video = await storage.createVideo({
      originalName: req.file.originalname,
      originalUrl: req.file.path,
    });

    // Start processing in background (no await)
    processVideo(video.id, req.file.path).catch(err => {
      console.error(`Error processing video ${video.id}:`, err);
      storage.updateVideoStatus(video.id, "error");
    });

    res.status(201).json(video);
  });

  return httpServer;
}

async function processVideo(videoId: number, videoPath: string) {
  try {
    // 1. Extract Audio
    await storage.updateVideoStatus(videoId, "transcribing");
    const audioPath = path.join('uploads', `audio-${videoId}.mp3`);
    await extractAudio(videoPath, audioPath);

    // 2. Transcribe
    const transcript = await transcribeAudio(audioPath);
    await storage.updateVideoTranscript(videoId, transcript);
    
    // Clean up audio file
    fs.unlinkSync(audioPath);

    // 3. Analyze & Score
    await storage.updateVideoStatus(videoId, "analyzing");
    const bestClips = await analyzeTranscript(transcript);

    // 4. Cut Clips
    for (const [index, clipData] of bestClips.entries()) {
      const clipFilename = `clip-${videoId}-${index}.mp4`;
      const clipPath = path.join('client/public/clips', clipFilename);
      
      await cutClip(videoPath, clipData.start, clipData.end, clipPath);

      await storage.createClip({
        videoId,
        startTime: clipData.start,
        endTime: clipData.end,
        summary: clipData.summary,
        viralityScore: clipData.score,
        url: `/clips/${clipFilename}` // Served statically by Vite/Express
      });
    }

    await storage.updateVideoStatus(videoId, "complete");

  } catch (error) {
    console.error("Processing failed:", error);
    await storage.updateVideoStatus(videoId, "error");
  }
}
