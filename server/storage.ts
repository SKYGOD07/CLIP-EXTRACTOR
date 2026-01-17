import { db } from "./db";
import {
  videos, clips,
  type Video, type InsertVideo,
  type Clip, type InsertClip,
} from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  // Videos
  getVideo(id: number): Promise<Video | undefined>;
  getVideos(): Promise<Video[]>;
  createVideo(video: InsertVideo): Promise<Video>;
  updateVideoStatus(id: number, status: string): Promise<Video>;
  updateVideoTranscript(id: number, transcript: any): Promise<Video>;
  updateVideoScore(id: number, score: number): Promise<Video>;
  
  // Clips
  getClips(videoId: number): Promise<Clip[]>;
  createClip(clip: InsertClip): Promise<Clip>;
}

export class DatabaseStorage implements IStorage {
  async getVideo(id: number): Promise<Video | undefined> {
    const [video] = await db.select().from(videos).where(eq(videos.id, id));
    return video;
  }

  async getVideos(): Promise<Video[]> {
    return await db.select().from(videos).orderBy(videos.createdAt);
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const [video] = await db.insert(videos).values(insertVideo).returning();
    return video;
  }

  async updateVideoStatus(id: number, status: string): Promise<Video> {
    const [video] = await db
      .update(videos)
      .set({ status })
      .where(eq(videos.id, id))
      .returning();
    return video;
  }

  async updateVideoTranscript(id: number, transcript: any): Promise<Video> {
    const [video] = await db
      .update(videos)
      .set({ transcript })
      .where(eq(videos.id, id))
      .returning();
    return video;
  }

  async updateVideoScore(id: number, score: number): Promise<Video> {
    const [video] = await db
      .update(videos)
      .set({ viralityScore: score })
      .where(eq(videos.id, id))
      .returning();
    return video;
  }

  async getClips(videoId: number): Promise<Clip[]> {
    return await db.select().from(clips).where(eq(clips.videoId, videoId));
  }

  async createClip(insertClip: InsertClip): Promise<Clip> {
    const [clip] = await db.insert(clips).values(insertClip).returning();
    return clip;
  }
}

export const storage = new DatabaseStorage();
