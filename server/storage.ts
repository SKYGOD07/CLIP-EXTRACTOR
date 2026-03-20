import { db as firestore } from "./lib/firebase";
import {
  type Video, type InsertVideo,
  type Clip, type InsertClip,
} from "@shared/schema";

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

export class FirebaseStorage implements IStorage {
  private videosColl = firestore.collection("videos");
  private clipsColl = firestore.collection("clips");

  async getVideo(id: number): Promise<Video | undefined> {
    const doc = await this.videosColl.doc(id.toString()).get();
    if (!doc.exists) return undefined;
    const data = doc.data();
    return { ...data, id: Number(doc.id) } as Video;
  }

  async getVideos(): Promise<Video[]> {
    const snapshot = await this.videosColl.orderBy("createdAt", "desc").get();
    return snapshot.docs.map(doc => ({ ...doc.data(), id: Number(doc.id) } as Video));
  }

  async createVideo(insertVideo: InsertVideo): Promise<Video> {
    const id = Date.now(); // Simple numeric ID for now to match schema
    const videoData = {
      ...insertVideo,
      createdAt: new Date(),
      status: "uploaded",
      viralityScore: 0,
    };
    await this.videosColl.doc(id.toString()).set(videoData);
    return { ...videoData, id } as Video;
  }

  async updateVideoStatus(id: number, status: string): Promise<Video> {
    await this.videosColl.doc(id.toString()).update({ status });
    const video = await this.getVideo(id);
    if (!video) throw new Error("Video not found");
    return video;
  }

  async updateVideoTranscript(id: number, transcript: any): Promise<Video> {
    await this.videosColl.doc(id.toString()).update({ transcript });
    const video = await this.getVideo(id);
    if (!video) throw new Error("Video not found");
    return video;
  }

  async updateVideoScore(id: number, score: number): Promise<Video> {
    await this.videosColl.doc(id.toString()).update({ viralityScore: score });
    const video = await this.getVideo(id);
    if (!video) throw new Error("Video not found");
    return video;
  }

  async getClips(videoId: number): Promise<Clip[]> {
    const snapshot = await this.clipsColl.where("videoId", "==", videoId).get();
    return snapshot.docs.map(doc => ({ ...doc.data(), id: Number(doc.id) } as Clip));
  }

  async createClip(insertClip: InsertClip): Promise<Clip> {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const clipData = { ...insertClip };
    await this.clipsColl.doc(id.toString()).set(clipData);
    return { ...clipData, id } as Clip;
  }
}

export const storage = new FirebaseStorage();
