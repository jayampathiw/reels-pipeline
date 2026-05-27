# Reels Pipeline

Generic, multi-platform short-form video pipeline. Niche-agnostic — wildlife is the first channel; the design supports any topic (fitness, travel, food, motivational, etc.).

**Sister project:** [facebook-news-pipeline](../facebook-news-pipeline) — text/image news articles. Shares the same Supabase project but has its own code, schedules, and failure modes.

## What this does

1. **Ingest** — pull video clips from Pexels, Pixabay, Internet Archive, AI generators (Veo/Sora/Runway), or manual uploads.
2. **Compose** — render a vertical 9:16 reel: clips + AI-generated narration + burned-in captions + music + watermark + CTA.
3. **Publish** — post to Facebook, Instagram Reels, YouTube Shorts, and TikTok with per-platform metadata.

One content item → many platforms. Each channel declares which platforms it targets.

## Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 20, ESM |
| AI | Anthropic Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) |
| DB (metadata) | Supabase (shared with news pipeline) |
| Storage (video) | **Cloudflare R2** — 10GB free, zero egress. Supabase Storage is NOT used for videos. |
| TTS | Kokoro (multilingual) |
| Composition | FFmpeg |
| Dashboard | Shared Angular dashboard (extended with niche + platform filters) |

## Quick start

```bash
npm install

# Ingest source clips for a channel
node src/scripts/ingest.js wildlife/EN

# Render an MP4 from a content item
node src/scripts/generate-reel.js <content_id>

# Publish to all target platforms declared by the channel
node src/scripts/publish.js <content_id>
```

See [docs/architecture.md](docs/architecture.md) for the full design and decision log.

## Channels

A *channel* is `(niche, language)`. Each channel declares:
- which fetchers to use and their query params
- which renderer + render config (duration, music, voice, CTA)
- which platforms it publishes to
- platform-specific credential keys

The first channels are `wildlife/factual/EN` + `wildlife/listicle/EN` (→ **NaturePulse** page) and `wildlife/cinematic/EN` + `wildlife/silent/EN` (→ **NatureFrame** page). Instagram, YouTube, and TikTok arrive in subsequent milestones.

## Status

🟢 **Render leg complete end-to-end** (2026-05-26). Pexels → Claude → TTS → Whisper → FFmpeg → R2 hosted URL all verified working. First reel `content_item id=1` rendered and hosted.

🟡 **FB API publishing deferred** to a later milestone. Current workflow: render via the pipeline, manually upload to Facebook via the web composer using `print-upload-package.js` to copy the caption.

See [docs/architecture.md](docs/architecture.md) for milestone plan + decisions log, and [docs/video-styles.md](docs/video-styles.md) for the per-style content strategy.
