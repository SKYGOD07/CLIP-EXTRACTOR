<div align="center">
  <img src="client/public/favicon.png" alt="VoxClip AI Logo" width="120" />
  <h1>🎙️ VoxClip AI – The Voice Video Editing Agent</h1>
  <p><strong>Transform video editing from a tedious, timeline-based workflow into a natural, conversational experience.</strong></p>

  [![Deploy with Vercel](https://vercel.com/button)](https://voxclip-ai.vercel.app/)
  
  [![Live Demo](https://img.shields.io/badge/Live_Demo-voxclip--ai.vercel.app-000000?style=for-the-badge&logo=vercel)](https://voxclip-ai.vercel.app/)
  [![GitHub License](https://img.shields.io/badge/license-MIT-blue.svg?style=for-the-badge)](LICENSE)
</div>

---

## 💡 Inspiration

Editing long videos to find highlights is slow and tedious. Content creators often spend hours manually scrubbing timelines just to find a few useful moments. We wanted to remove this friction by replacing manual editing with a futuristic conversational AI experience.

The idea was simple: **what if you could edit videos just by talking to an AI agent?**

Instead of searching for clips manually, users can say commands like:
- *"Extract the highlight."*
- *"Cut the funny moment."*
- *"Remove silent parts."*

The agent understands the command, analyzes the video contextually, and generates optimal clips automatically.

## ✨ What it does

**VoxClip AI** is a real-time multimodal AI agent that lets users edit videos using natural voice commands. 

The system deeply analyzes both audio transcripts and video content simultaneously to identify meaningful segments and automatically extracts, scores, and generates optimized clips.

### 🎯 Key Capabilities
* **Voice-Controlled Video Editing:** Command the edits naturally without touching a timeline.
* **Automatic Highlight Detection:** Smart scoring of segments based on sentiment, speech intensity, and conversational context.
* **Silence and Filler Removal:** Automatically detect and trim dead air, "ums", and "uhs".
* **Smart Clip Extraction:** Instantly produces share-ready clips from long-form content.
* **Real-Time Conversational Interaction:** A responsive interface that mimics working with a human editor.

## 🏗️ How we built it

The system uses a modern AI-driven architecture combining multimodal reasoning with robust video processing.

### Pipeline:
1. **Upload & Speak:** The user uploads a long video and provides a natural voice command.
2. **Interpret Intent:** Google Gemini processes the speech to interpret the user's intent.
3. **Extract & Transcribe:** Audio is extracted from the video using FFmpeg, and a precise transcript is generated.
4. **AI Scoring:** Contextual AI scoring identifies the most relevant highlight segments based on the prompt.
5. **Clip Generation:** The system automatically cuts the best clips and returns them instantly to the clean, responsive user interface.

## 🛑 Challenges we ran into

The biggest challenge was interpreting highly ambiguous voice commands. Commands like *"Find the interesting part"* do not include timestamps or precise instructions.

To solve this, we combined multiple signals:
* Transcript sentiment analysis
* Speech intensity and volume spikes
* Keyword and topical detection
* Overarching contextual scoring

Another significant challenge was processing large videos efficiently while maintaining ultra-responsive, real-time interactions for the user.

## 🏆 Accomplishments we're proud of

We successfully built a production-ready working prototype where:
* Video editing becomes entirely **voice-driven**.
* High-quality clips are **generated automatically**.
* The AI agent responds **conversationally and contextually**.

We successfully transformed a complex workflow (timeline-based video production) into an effortless conversational interface.

## 📚 What we learned

This project demonstrated exactly how multimodal AI agents are uniquely positioned to completely transform creative workflows. By bridging voice interaction, deep video understanding, and automated editing pipelines, we created a system that removes the traditional barriers of video production for creators everywhere.

## 🚀 What's next

Future improvements to VoxClip AI include:
* **Emotion Detection:** Analyzing video frames for facial expressions and visual emotion.
* **Automatic Subtitles:** Generating styled burn-in captions for social media.
* **Social Media Formatting:** Auto-cropping clips perfectly for YouTube Shorts, Instagram Reels, and TikTok.
* **Multi-Speaker Highlight Detection:** Recognizing and focusing on specific speakers conversationally.
* **Smarter Workflows:** More complex, chained conversational editing prompts.

## 🛠️ Built With

* ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) 
* ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
* ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
* ![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
* ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
* ![FFmpeg](https://img.shields.io/badge/FFmpeg-007808.svg?style=for-the-badge&logo=FFmpeg&logoColor=white)
* ![Google Cloud](https://img.shields.io/badge/GoogleCloud-%234285F4.svg?style=for-the-badge&logo=google-cloud&logoColor=white) (Cloud Run & Cloud Storage)
* **Google Gemini API & GenAI SDK**

---
<div align="center">
  <b>Built for the Gemini Live Agent Hackathon</b>
</div>
