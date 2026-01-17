// import ffmpeg from 'fluent-ffmpeg';
// import path from 'path';

// export async function extractAudio(videoPath: string, outputPath: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     ffmpeg(videoPath)
//       .output(outputPath)
//       .noVideo()
//       .audioCodec('libmp3lame') // Or libopus/pcm for Whisper, but mp3 is safe
//       .on('end', () => resolve(outputPath))
//       .on('error', (err) => reject(err))
//       .run();
//   });
// }

// export async function cutClip(videoPath: string, start: number, end: number, outputPath: string): Promise<string> {
//   return new Promise((resolve, reject) => {
//     ffmpeg(videoPath)
//       .setStartTime(start)
//       .setDuration(end - start)
//       .output(outputPath)
//       .on('end', () => resolve(outputPath))
//       .on('error', (err) => reject(err))
//       .run();
//   });
// }

import ffmpeg from 'fluent-ffmpeg';
import path from 'path';
import fs from 'fs';

interface VideoMetadata {
  duration: number;
  width: number;
  height: number;
  codec: string;
  fps: number;
}

/**
 * Get video metadata
 */
export async function getVideoMetadata(videoPath: string): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      if (err) {
        reject(new Error(`Failed to probe video: ${err.message}`));
        return;
      }

      const videoStream = metadata.streams.find(s => s.codec_type === 'video');
      
      if (!videoStream) {
        reject(new Error('No video stream found'));
        return;
      }

      resolve({
        duration: metadata.format.duration || 0,
        width: videoStream.width || 0,
        height: videoStream.height || 0,
        codec: videoStream.codec_name || 'unknown',
        fps: eval(videoStream.r_frame_rate || '30/1'), // e.g., "30/1" -> 30
      });
    });
  });
}

/**
 * Extract audio with quality settings
 */
export async function extractAudio(
  videoPath: string, 
  outputPath: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    console.log(`Extracting audio: ${videoPath} -> ${outputPath}`);

    ffmpeg(videoPath)
      .output(outputPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .audioBitrate('128k')
      .audioChannels(1) // Mono for smaller file size
      .audioFrequency(16000) // 16kHz for speech
      .on('start', (cmd) => {
        console.log('FFmpeg command:', cmd);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`Audio extraction: ${progress.percent.toFixed(1)}%`);
        }
      })
      .on('end', () => {
        console.log('✓ Audio extraction complete');
        resolve(outputPath);
      })
      .on('error', (err) => {
        console.error('Audio extraction error:', err);
        reject(new Error(`Audio extraction failed: ${err.message}`));
      })
      .run();
  });
}

/**
 * Validate clip parameters
 */
function validateClipParams(
  start: number, 
  end: number, 
  videoDuration: number
): { start: number; end: number } {
  
  // Ensure start is not negative
  start = Math.max(0, start);
  
  // Ensure end doesn't exceed video duration
  end = Math.min(end, videoDuration);
  
  // Ensure start < end
  if (start >= end) {
    throw new Error(`Invalid clip times: start (${start}s) >= end (${end}s)`);
  }

  const duration = end - start;

  // Check minimum duration (5 seconds)
  if (duration < 5) {
    console.warn(`Clip too short (${duration}s), extending to 5s`);
    const extension = (5 - duration) / 2;
    start = Math.max(0, start - extension);
    end = Math.min(videoDuration, end + extension);
  }

  // Check maximum duration (5 minutes)
  if (duration > 300) {
    console.warn(`Clip too long (${duration}s), trimming to 300s`);
    end = start + 300;
  }

  return { start, end };
}

/**
 * Cut a clip from video with validation and optimization
 */
export async function cutClip(
  videoPath: string,
  start: number,
  end: number,
  outputPath: string
): Promise<string> {
  
  // Get video metadata first
  const metadata = await getVideoMetadata(videoPath);
  
  // Validate and adjust clip parameters
  const adjusted = validateClipParams(start, end, metadata.duration);
  const duration = adjusted.end - adjusted.start;

  console.log(`Cutting clip: ${adjusted.start.toFixed(2)}s - ${adjusted.end.toFixed(2)}s (${duration.toFixed(2)}s)`);

  return new Promise((resolve, reject) => {
    // Ensure output directory exists
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const command = ffmpeg(videoPath)
      .setStartTime(adjusted.start)
      .setDuration(duration)
      .output(outputPath)
      // Quality settings for social media
      .videoCodec('libx264')
      .videoBitrate('2000k')
      .size('?x1080') // Max height 1080p, maintain aspect ratio
      .fps(30) // Standardize to 30fps
      .audioCodec('aac')
      .audioBitrate('128k')
      // Fast encoding preset
      .outputOptions([
        '-preset', 'fast',
        '-crf', '23', // Quality (lower = better, 23 is good balance)
        '-movflags', '+faststart', // Optimize for web streaming
      ])
      .on('start', (cmd) => {
        console.log('FFmpeg command:', cmd);
      })
      .on('progress', (progress) => {
        if (progress.percent) {
          console.log(`Clip progress: ${progress.percent.toFixed(1)}%`);
        }
      })
      .on('end', () => {
        console.log('✓ Clip created successfully');
        
        // Verify output file exists
        if (fs.existsSync(outputPath)) {
          const stats = fs.statSync(outputPath);
          console.log(`Output file size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
          resolve(outputPath);
        } else {
          reject(new Error('Output file was not created'));
        }
      })
      .on('error', (err) => {
        console.error('Clip cutting error:', err);
        
        // Clean up failed output file if it exists
        if (fs.existsSync(outputPath)) {
          try {
            fs.unlinkSync(outputPath);
          } catch (e) {
            console.error('Failed to clean up partial file:', e);
          }
        }
        
        reject(new Error(`Clip cutting failed: ${err.message}`));
      });

    command.run();
  });
}

/**
 * Validate video file
 */
export async function validateVideoFile(videoPath: string): Promise<boolean> {
  try {
    if (!fs.existsSync(videoPath)) {
      console.error(`Video file not found: ${videoPath}`);
      return false;
    }

    const metadata = await getVideoMetadata(videoPath);
    
    if (metadata.duration <= 0) {
      console.error('Video has zero or negative duration');
      return false;
    }

    if (metadata.width <= 0 || metadata.height <= 0) {
      console.error('Video has invalid dimensions');
      return false;
    }

    console.log(`Video validated: ${metadata.duration.toFixed(1)}s, ${metadata.width}x${metadata.height}, ${metadata.codec}`);
    return true;

  } catch (error) {
    console.error('Video validation failed:', error);
    return false;
  }
}

/**
 * Get video duration (convenience function)
 */
export async function getVideoDuration(videoPath: string): Promise<number> {
  const metadata = await getVideoMetadata(videoPath);
  return metadata.duration;
}