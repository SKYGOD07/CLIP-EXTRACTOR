// import OpenAI from "openai";

// const openai = new OpenAI({
//   apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
//   baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
// });

// interface TranscriptSegment {
//   start: number;
//   end: number;
//   text: string;
// }

// interface AnalyzedClip {
//   start: number;
//   end: number;
//   score: number;
//   summary: string;
// }

// export async function analyzeTranscript(segments: TranscriptSegment[]): Promise<AnalyzedClip[]> {
//   // 1. Chunk the transcript into ~30s windows (simple approach)
//   // Logic: Iterate segments, group them until duration > 30s.
//   const chunks = [];
//   let currentChunk: { start: number; end: number; text: string; } | null = null;

//   for (const seg of segments) {
//     if (!currentChunk) {
//       currentChunk = { start: seg.start, end: seg.end, text: seg.text };
//     } else {
//       if (seg.end - currentChunk.start < 45) { // Allow up to 45s chunks
//         currentChunk.end = seg.end;
//         currentChunk.text += " " + seg.text;
//       } else {
//         chunks.push(currentChunk);
//         currentChunk = { start: seg.start, end: seg.end, text: seg.text };
//       }
//     }
//   }
//   if (currentChunk) chunks.push(currentChunk);

//   // 2. Score each chunk using LLM
//   // We'll batch this or do it sequentially. For simplicity/reliability, sequential.
//   const scoredClips: AnalyzedClip[] = [];

//   const prompt = `
//     Analyze this video transcript segment. 
//     Rate its "virality potential" on a scale of 0-100.
//     Provide a short 1-sentence summary.
//     Return JSON: { "score": number, "summary": "string" }
//   `;

//   for (const chunk of chunks) {
//     try {
//       const response = await openai.chat.completions.create({
//         model: "gpt-5.1",
//         messages: [
//           { role: "system", content: prompt },
//           { role: "user", content: chunk.text }
//         ],
//         response_format: { type: "json_object" },
//       });

//       const result = JSON.parse(response.choices[0].message.content || "{}");
      
//       if (result.score && result.summary) {
//         scoredClips.push({
//           start: chunk.start,
//           end: chunk.end,
//           score: result.score,
//           summary: result.summary
//         });
//       }
//     } catch (e) {
//       console.error("Error analyzing chunk:", e);
//     }
//   }

//   // 3. Sort by score and take top 5
//   return scoredClips.sort((a, b) => b.score - a.score).slice(0, 5);
// }
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

interface TranscriptSegment {
  start: number;
  end: number;
  text: string;
}

interface AnalyzedClip {
  start: number;
  end: number;
  score: number;
  summary: string;
}

interface ClipChunk {
  start: number;
  end: number;
  text: string;
  duration: number;
}

// Configuration
const CONFIG = {
  MIN_CLIP_DURATION: 5,    // 5 seconds minimum
  MAX_CLIP_DURATION: 300,  // 5 minutes maximum
  TARGET_CLIP_DURATION: 30, // Target 30 seconds
  MAX_CLIPS: 10,           // Maximum clips to generate
  MIN_SCORE_THRESHOLD: 60, // Minimum virality score to include
};

/**
 * Intelligently chunk transcript into variable-length clips (5s - 5min)
 * Prioritizes natural breaks and semantic coherence
 */
function createSmartChunks(segments: TranscriptSegment[]): ClipChunk[] {
  if (!segments || segments.length === 0) return [];

  const chunks: ClipChunk[] = [];
  let currentChunk: ClipChunk | null = null;

  for (const seg of segments) {
    const segDuration = seg.end - seg.start;

    // Skip segments that are too short or invalid
    if (segDuration < 0.5) continue;

    if (!currentChunk) {
      // Start new chunk
      currentChunk = {
        start: seg.start,
        end: seg.end,
        text: seg.text,
        duration: segDuration,
      };
    } else {
      const potentialDuration = seg.end - currentChunk.start;
      const isNaturalBreak = seg.text.match(/[.!?]$/);
      
      // Decision logic for extending vs. creating new chunk
      if (potentialDuration < CONFIG.MIN_CLIP_DURATION) {
        // Too short, must extend
        currentChunk.end = seg.end;
        currentChunk.text += " " + seg.text;
        currentChunk.duration = currentChunk.end - currentChunk.start;
      } else if (potentialDuration > CONFIG.MAX_CLIP_DURATION) {
        // Exceeded max duration, finalize current chunk
        chunks.push(currentChunk);
        currentChunk = {
          start: seg.start,
          end: seg.end,
          text: seg.text,
          duration: segDuration,
        };
      } else if (
        potentialDuration >= CONFIG.TARGET_CLIP_DURATION && 
        isNaturalBreak
      ) {
        // Hit target duration at natural break, finalize
        currentChunk.end = seg.end;
        currentChunk.text += " " + seg.text;
        currentChunk.duration = currentChunk.end - currentChunk.start;
        chunks.push(currentChunk);
        currentChunk = null;
      } else {
        // Continue extending
        currentChunk.end = seg.end;
        currentChunk.text += " " + seg.text;
        currentChunk.duration = currentChunk.end - currentChunk.start;
      }
    }
  }

  // Add final chunk if it meets minimum duration
  if (currentChunk && currentChunk.duration >= CONFIG.MIN_CLIP_DURATION) {
    chunks.push(currentChunk);
  }

  return chunks;
}

/**
 * Fallback scoring without API
 * Uses heuristics based on text patterns
 */
function scoreFallback(text: string): number {
  let score = 50; // Base score

  // Positive indicators
  const positivePatterns = [
    /\b(amazing|incredible|wow|insane|genius|brilliant|perfect)\b/gi,
    /[!?]{2,}/g,  // Multiple exclamation/question marks
    /\b(you won't believe|here's why|this is|the secret)\b/gi,
    /\b(tip|trick|hack|method|way to|how to)\b/gi,
    /\b(million|billion|thousand)\b/gi,
  ];

  positivePatterns.forEach(pattern => {
    const matches = text.match(pattern);
    if (matches) score += matches.length * 5;
  });

  // Length bonus (sweet spot around 20-40 words)
  const wordCount = text.split(/\s+/).length;
  if (wordCount >= 15 && wordCount <= 50) {
    score += 10;
  }

  // Question bonus (questions drive engagement)
  if (text.includes("?")) {
    score += 10;
  }

  // Cap at 100
  return Math.min(100, score);
}

/**
 * Generate summary without API
 */
function generateFallbackSummary(text: string): string {
  // Take first sentence or first 100 characters
  const firstSentence = text.match(/^[^.!?]+[.!?]/);
  if (firstSentence) {
    return firstSentence[0].trim();
  }
  
  return text.substring(0, 100) + (text.length > 100 ? "..." : "");
}

/**
 * Score chunks using OpenAI API
 */
async function scoreWithAPI(chunks: ClipChunk[]): Promise<AnalyzedClip[]> {
  const scoredClips: AnalyzedClip[] = [];

  const systemPrompt = `You are an expert at analyzing video content for social media virality.
Rate the virality potential of video segments on a scale of 0-100 based on:
- Emotional impact and hook potential
- Information value and uniqueness
- Shareability and relatability
- Entertainment value
- Call-to-action or cliffhanger elements

Return JSON: { "score": number (0-100), "summary": "one sentence describing the key moment" }`;

  for (const chunk of chunks) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: systemPrompt },
          { 
            role: "user", 
            content: `Duration: ${chunk.duration.toFixed(1)}s\n\nTranscript:\n${chunk.text}` 
          }
        ],
        response_format: { type: "json_object" },
        temperature: 0.3,
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      if (result.score !== undefined && result.summary) {
        scoredClips.push({
          start: chunk.start,
          end: chunk.end,
          score: Math.min(100, Math.max(0, result.score)),
          summary: result.summary,
        });
      }
    } catch (error) {
      console.error("API scoring failed for chunk, using fallback:", error);
      // Fallback to heuristic scoring
      scoredClips.push({
        start: chunk.start,
        end: chunk.end,
        score: scoreFallback(chunk.text),
        summary: generateFallbackSummary(chunk.text),
      });
    }
  }

  return scoredClips;
}

/**
 * Score chunks without API (pure heuristics)
 */
function scoreWithoutAPI(chunks: ClipChunk[]): AnalyzedClip[] {
  return chunks.map(chunk => ({
    start: chunk.start,
    end: chunk.end,
    score: scoreFallback(chunk.text),
    summary: generateFallbackSummary(chunk.text),
  }));
}

/**
 * Main analysis function with automatic API fallback
 */
export async function analyzeTranscript(
  segments: TranscriptSegment[]
): Promise<AnalyzedClip[]> {
  
  // 1. Create smart chunks (5s - 5min)
  const chunks = createSmartChunks(segments);
  
  console.log(`Created ${chunks.length} chunks from ${segments.length} segments`);
  
  if (chunks.length === 0) {
    console.warn("No valid chunks created from transcript");
    return [];
  }

  // 2. Score chunks (with API fallback)
  let scoredClips: AnalyzedClip[];
  
  const hasAPIKey = !!process.env.AI_INTEGRATIONS_OPENAI_API_KEY;
  
  if (hasAPIKey) {
    console.log("Using OpenAI API for scoring");
    try {
      scoredClips = await scoreWithAPI(chunks);
    } catch (error) {
      console.error("API scoring completely failed, falling back to heuristics:", error);
      scoredClips = scoreWithoutAPI(chunks);
    }
  } else {
    console.log("No API key found, using heuristic scoring");
    scoredClips = scoreWithoutAPI(chunks);
  }

  // 3. Filter by minimum score and sort
  const filteredClips = scoredClips
    .filter(clip => clip.score >= CONFIG.MIN_SCORE_THRESHOLD)
    .sort((a, b) => b.score - a.score);

  // 4. Take top N clips
  const topClips = filteredClips.slice(0, CONFIG.MAX_CLIPS);

  console.log(`Selected ${topClips.length} clips with scores: ${topClips.map(c => c.score).join(", ")}`);

  return topClips;
}

/**
 * Validate clip duration constraints
 */
export function validateClipDuration(start: number, end: number): boolean {
  const duration = end - start;
  return duration >= CONFIG.MIN_CLIP_DURATION && 
         duration <= CONFIG.MAX_CLIP_DURATION;
}

/**
 * Adjust clip boundaries to meet duration constraints
 */
export function adjustClipBoundaries(
  start: number, 
  end: number, 
  videoDuration: number
): { start: number; end: number } {
  let duration = end - start;

  // If too short, extend symmetrically
  if (duration < CONFIG.MIN_CLIP_DURATION) {
    const extension = (CONFIG.MIN_CLIP_DURATION - duration) / 2;
    start = Math.max(0, start - extension);
    end = Math.min(videoDuration, end + extension);
    duration = end - start;
  }

  // If still too short (at boundaries), extend from one side
  if (duration < CONFIG.MIN_CLIP_DURATION) {
    if (start === 0) {
      end = Math.min(videoDuration, CONFIG.MIN_CLIP_DURATION);
    } else {
      start = Math.max(0, end - CONFIG.MIN_CLIP_DURATION);
    }
  }

  // If too long, trim from end
  if (duration > CONFIG.MAX_CLIP_DURATION) {
    end = start + CONFIG.MAX_CLIP_DURATION;
  }

  return { start, end };
}