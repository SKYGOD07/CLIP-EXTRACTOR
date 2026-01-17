import ffmpeg from 'fluent-ffmpeg';
import path from 'path';

export async function extractAudio(videoPath: string, outputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .output(outputPath)
      .noVideo()
      .audioCodec('libmp3lame') // Or libopus/pcm for Whisper, but mp3 is safe
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
}

export async function cutClip(videoPath: string, start: number, end: number, outputPath: string): Promise<string> {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .setStartTime(start)
      .setDuration(end - start)
      .output(outputPath)
      .on('end', () => resolve(outputPath))
      .on('error', (err) => reject(err))
      .run();
  });
}
