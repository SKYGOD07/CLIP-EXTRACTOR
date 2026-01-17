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

export async function analyzeTranscript(segments: TranscriptSegment[]): Promise<AnalyzedClip[]> {
  // 1. Chunk the transcript into ~30s windows (simple approach)
  // Logic: Iterate segments, group them until duration > 30s.
  const chunks = [];
  let currentChunk: { start: number; end: number; text: string; } | null = null;

  for (const seg of segments) {
    if (!currentChunk) {
      currentChunk = { start: seg.start, end: seg.end, text: seg.text };
    } else {
      if (seg.end - currentChunk.start < 45) { // Allow up to 45s chunks
        currentChunk.end = seg.end;
        currentChunk.text += " " + seg.text;
      } else {
        chunks.push(currentChunk);
        currentChunk = { start: seg.start, end: seg.end, text: seg.text };
      }
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  // 2. Score each chunk using LLM
  // We'll batch this or do it sequentially. For simplicity/reliability, sequential.
  const scoredClips: AnalyzedClip[] = [];

  const prompt = `
    Analyze this video transcript segment. 
    Rate its "virality potential" on a scale of 0-100.
    Provide a short 1-sentence summary.
    Return JSON: { "score": number, "summary": "string" }
  `;

  for (const chunk of chunks) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [
          { role: "system", content: prompt },
          { role: "user", content: chunk.text }
        ],
        response_format: { type: "json_object" },
      });

      const result = JSON.parse(response.choices[0].message.content || "{}");
      
      if (result.score && result.summary) {
        scoredClips.push({
          start: chunk.start,
          end: chunk.end,
          score: result.score,
          summary: result.summary
        });
      }
    } catch (e) {
      console.error("Error analyzing chunk:", e);
    }
  }

  // 3. Sort by score and take top 5
  return scoredClips.sort((a, b) => b.score - a.score).slice(0, 5);
}
