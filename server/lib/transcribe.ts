import fs from 'fs';
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export async function transcribeAudio(filePath: string): Promise<any[]> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(filePath),
      model: "gpt-4o-mini-transcribe",
      response_format: "verbose_json",
      timestamp_granularities: ["segment"],
    });

    // Map segments to our format
    return transcription.segments?.map((seg: any) => ({
      start: seg.start,
      end: seg.end,
      text: seg.text.trim(),
    })) || [];
  } catch (error) {
    console.error("Transcription error:", error);
    throw new Error("Failed to transcribe video");
  }
}
