import { pgTable, text, serial, integer, boolean, timestamp, jsonb, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// === TABLE DEFINITIONS ===
export const videos = pgTable("videos", {
  id: serial("id").primaryKey(),
  originalName: text("original_name").notNull(),
  originalUrl: text("original_url").notNull(), // Temporary local path or S3 URL
  status: text("status").notNull().default("uploaded"), // uploaded, transcribing, analyzing, complete, error
  transcript: jsonb("transcript"), // Array of {start, end, text}
  viralityScore: doublePrecision("virality_score"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const clips = pgTable("clips", {
  id: serial("id").primaryKey(),
  videoId: integer("video_id").references(() => videos.id).notNull(),
  startTime: doublePrecision("start_time").notNull(),
  endTime: doublePrecision("end_time").notNull(),
  summary: text("summary"),
  viralityScore: doublePrecision("virality_score"),
  url: text("url").notNull(), // Path to the clip
  createdAt: timestamp("created_at").defaultNow(),
});

// === BASE SCHEMAS ===
export const insertVideoSchema = createInsertSchema(videos).omit({ id: true, createdAt: true, status: true, transcript: true, viralityScore: true });
export const insertClipSchema = createInsertSchema(clips).omit({ id: true, createdAt: true });

// === EXPLICIT API CONTRACT TYPES ===
export type Video = typeof videos.$inferSelect;
export type InsertVideo = z.infer<typeof insertVideoSchema>;

export type Clip = typeof clips.$inferSelect;
export type InsertClip = z.infer<typeof insertClipSchema>;

export type CreateVideoRequest = InsertVideo;
export type VideoResponse = Video & { clips?: Clip[] };
export type VideosListResponse = Video[];

// Helper type for transcript segment
export type TranscriptSegment = {
  start: number;
  end: number;
  text: string;
};
