# Reels Pipeline — Project Guide

## What This Is

Generic short-form vertical video pipeline. Composes 9:16 reels from clips + AI narration + music + captions, and posts them to multiple platforms (Facebook, Instagram Reels, YouTube Shorts, TikTok). Niche-agnostic — first channel is wildlife in English, but the architecture supports any niche/language.

**Sister project:** `../facebook-news-pipeline` (news articles, text+image, Facebook only). Both pipelines share one Supabase project but live in separate repos. Do not import code between them — if something genuinely deserves sharing, extract it to an npm package first.

## Stack

| Layer | Tool |
|---|---|
| Runtime | Node.js 20, ESM (`"type": "module"`) |
| AI | Anthropic Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) |
| DB | Supabase (shared project `nnxtvbolhuvihlpwppbj`) |
| Video storage | **Cloudflare R2** — do NOT use Supabase Storage for MP4s |
| TTS | Kokoro (multilingual, called via `src/renderers/tts.py`) |
| Composition | FFmpeg |
| Package manager | npm |

## Project Structure

```
src/
├── config/
│   └── channels.js              ← channel definitions (niche × language)
├── fetchers/                    ← source clip ingestion (one file per source)
│   ├── pexels.js
│   ├── pixabay.js
│   ├── archive-org.js
│   ├── ai-video.js              ← Veo/Sora/Runway adapter
│   └── manual-upload.js         ← reads from R2 inbox bucket
├── renderers/
│   ├── reel.js                  ← short-form composer (15-60s)
│   ├── compose.js               ← FFmpeg orchestration helpers
│   └── tts.py                   ← Kokoro wrapper
├── services/
│   ├── supabase.js              ← DB client + CRUD helpers
│   ├── claude.js                ← narration + caption + hashtag generation
│   ├── storage.js               ← Cloudflare R2 adapter
│   └── publishers/              ← one file per platform, shared interface
│       ├── index.js             ← router: picks publisher by platform key
│       ├── facebook.js
│       ├── instagram.js
│       ├── youtube.js
│       └── tiktok.js
├── utils/
│   ├── content-item.js          ← ContentItem shape + normalization
│   └── dedup.js
├── scripts/
│   ├── ingest.js                ← CLI: run fetchers for a channel
│   ├── generate-reel.js         ← CLI: render MP4 for one or more content_ids
│   ├── publish.js               ← CLI: post a content_id to its target platforms (API; deferred)
│   └── print-upload-package.js  ← CLI: print URL + caption + hashtags for manual upload
└── pipeline.js                  ← orchestrator (ingest → render → publish)

supabase/migrations/             ← schema migrations
assets/music/                    ← royalty-free tracks per mood
assets/logos/                    ← per-channel watermark PNGs
output/reels/                    ← rendered MP4s (local cache, gitignored)
docs/                            ← architecture + decision log
```

## Channel Pattern

A channel is `(niche, style, language)` keyed as `niche/style/LANG` (e.g. `wildlife/factual/EN`). Three dimensions:
- **niche** — topic (`wildlife`, `fitness`, `travel`, …)
- **style** — `factual` | `cinematic` | `listicle` | `silent`
- **language** — `en`, `fr`, `it`, …

Multiple channels can publish to the same FB Page (and therefore share an `envKey`). At launch: `wildlife/factual/EN` + `wildlife/listicle/EN` both → `WILDLIFE_DAILY`; `wildlife/cinematic/EN` + `wildlife/silent/EN` both → `WILD_CINEMA`.

Defined in `src/config/channels.js`. Adding a new channel = add a block; no other code changes needed.

## Renderer Modes

The reel renderer reads `rendererConfig.mode` and branches:

| Mode | Narration | Captions | Voice speed | Music feel |
|---|---|---|---|---|
| `factual` | ✓ Hook + 3 facts + CTA | ✓ burned-in | 1.00× | uplifting |
| `cinematic` | ✓ Evocative + reverent close | ✓ burned-in | 0.85× | epic / atmospheric |
| `listicle` | ✓ Countdown N→1 | ✓ burned-in | 1.05× | upbeat |
| `silent` | ✗ none | ✗ none | n/a | dominant (loud ambient/music) |

All modes share clip concat at 9:16, watermark bottom-right, two-line CTA overlay near the end. Silent mode skips Claude `narration_script`, TTS, and Whisper entirely. Claude still produces FB caption + hashtags.

## Strategy & content decisions

[`docs/video-styles.md`](docs/video-styles.md) — full per-style comparison, decision framework, metrics per style, and the rationale behind the 2-page / 4-style mapping. Read this before generating, reviewing, or approving any reel.

## Publisher Interface

Every publisher in `src/services/publishers/` implements the same contract:

```js
// signature
export async function publish(contentItem, channelConfig) {
  // contentItem: row from content_items (incl. rendered_video_url)
  // channelConfig: the channel block from channels.js
  // returns: { postId: string, postedAt: Date, platformUrl: string }
  // throws on failure with a structured error
}

// capability declaration
export const capabilities = {
  maxDurationSec: 60,
  aspectRatios: ['9:16'],
  maxFileSizeMB: 100,
  supportsScheduling: true,
};
```

`publishers/index.js` exports a `publishToAll(contentItem, channelConfig)` that fans out to every platform with `enabled: true`. Failures on one platform don't block others — each result is written back to the per-platform status column.

## Storage Rules

- **Metadata** → Supabase (`content_items` table)
- **Rendered MP4s** → Cloudflare R2 bucket `reels-rendered`
- **Source clips downloaded for composition** → ephemeral `/tmp/`, deleted after render
- **Manual uploads / your own clips** → R2 bucket `reels-inbox`, fetched by `manual-upload.js`

The `storage.js` adapter takes a local path and returns a public R2 URL after upload. Never write a video binary into Supabase.

## Codebase Conventions

- All source files use ESM (`import`/`export`), not CommonJS.
- No TypeScript in `src/` — plain JavaScript.
- No comments unless explaining a non-obvious constraint.
- Errors use `console.error` with structured JSON. No `console.log` in production paths.
- Claude calls use Haiku 4.5 with prompt caching (`cache_control: { type: 'ephemeral' }` on a shared system prompt). Same caching pattern as the news pipeline.
- Facebook + Instagram use Graph API **v22.0**. Never downgrade.

## Database

Schema lives in `supabase/migrations/001_content_items.sql`. The single table is `content_items`. See [docs/architecture.md](docs/architecture.md) for the field-by-field rationale.

Per-platform status (`fb_status`, `ig_status`, `yt_status`, `tt_status`) is denormalized onto the row instead of a separate publications table — at 4 platforms this is simpler and the query patterns favor it.

## Environment Variables

Copy `.env.example` to `.env`. Never commit `.env`. Per-channel credentials are keyed by `envKey` from `channels.js`:

```
# core
SUPABASE_URL=
SUPABASE_KEY=
ANTHROPIC_KEY=

# Cloudflare R2
R2_ACCOUNT_ID=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET_RENDERED=reels-rendered
R2_BUCKET_INBOX=reels-inbox
R2_PUBLIC_BASE_URL=

# per-page platform creds (suffix = envKey, shared by channels on the same page)
FB_PAGE_ID_WILDLIFE_DAILY=
FB_ACCESS_TOKEN_WILDLIFE_DAILY=
FB_PAGE_ID_WILD_CINEMA=
FB_ACCESS_TOKEN_WILD_CINEMA=
# IG / YT / TT creds added in later milestones

# content APIs
PEXELS_API_KEY=
PIXABAY_API_KEY=
```

## Content Policy

Same baseline rules as the news pipeline:
- No content involving minors in harmful contexts.
- No graphic violence, hunting kills, or animal cruelty footage (wildlife channel specifically).
- All clips must be properly licensed (Pexels/Pixabay are CC0; Internet Archive requires per-item check).
- Always credit the original source in the description if license requires.

## Status

🟢 **Render leg complete end-to-end** (2026-05-26). Pexels → Claude (Opus 4.7 via oneprovider.dev) → TTS (Kokoro) → Whisper → FFmpeg → R2 hosted URL all verified working. First reel rendered as `content_item id=1`, hosted at `pub-*.r2.dev/reels/1/1.mp4`.

🟡 **FB API publish deferred.** User chose to manually upload via FB web composer until cadence justifies API automation. Publisher code is written and tested-by-shape; activating it is a flip-the-switch task documented in [docs/architecture.md](docs/architecture.md) decisions log.

## Daily workflow (manual-upload mode)

```bash
# 1. Pull fresh source clips + create a content_item row
node src/scripts/ingest.js wildlife/factual/EN
# → prints: content_item id=<N>

# 2. Generate everything: Claude + TTS + captions + FFmpeg + R2 upload
node src/scripts/generate-reel.js <N>

# 3. Get the upload package (URL + caption + hashtags ready to paste)
node src/scripts/print-upload-package.js <N>
```

Then paste the R2 MP4 URL into Facebook's web video uploader (or download first and upload the file) and paste the caption block.

When ready to flip on API publishing, see deferred task `#13` in the task list.
