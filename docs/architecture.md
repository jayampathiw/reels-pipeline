# Reels Pipeline — Architecture

## Goals

1. Generate vertical short-form reels for any niche, in any language, with no per-niche code changes (just config).
2. Publish one rendered MP4 to multiple platforms (Facebook, Instagram, YouTube Shorts, TikTok) with per-platform metadata.
3. Stay inside Supabase + R2 free tiers for the foreseeable future.
4. Decouple from the news pipeline. Both share the same Supabase project but ship and break independently.

## Non-goals (for now)

- Real-time / per-event posting. Reels are batch-rendered.
- Per-user personalization or A/B testing within a platform.
- Self-hosted video rendering at scale. Local FFmpeg is the rendering substrate; if it ever becomes the bottleneck we move to a render queue or a managed service.

## Core abstractions

### Channel

A *channel* is `(niche, style, language)` keyed as `niche/style/LANG`. It is the unit the operator thinks in ("the cinematic English wildlife channel"). Defined entirely in `src/config/channels.js`. A channel declares:

- its **niche** (`wildlife`, `fitness`, …), **style** (`factual` | `cinematic` | `listicle` | `silent`), and **language**
- which **fetchers** to run and their query params
- which **renderer** to use and its `mode` + render config (duration, music, voice, CTA)
- which **platforms** to publish to (with per-platform `enabled` flag)
- a shared `envKey` suffix that maps to platform credentials in `.env` — multiple channels can share an envKey when they post to the same Page
- watermark + page name for overlays

At launch, four channels split across two FB pages:

| Channel | Page (envKey) |
|---|---|
| `wildlife/factual/EN`   | `NATURE_PULSE` |
| `wildlife/listicle/EN`  | `NATURE_PULSE` |
| `wildlife/cinematic/EN` | `NATURE_FRAME` |
| `wildlife/silent/EN`    | `NATURE_FRAME` |

This lets each Page build a coherent brand (informational vs cinematic) while giving us two adjacent style variants per Page to test for engagement.

### ContentItem

A row in `content_items` is the canonical unit moving through the pipeline. It carries provenance (`source_clips`), AI output (`narration_script`, `ai_caption`), the rendered MP4 URL, overall `status`, and per-platform sub-statuses.

Per-platform status is denormalized onto the row (`fb_status`, `ig_status`, …) because at 4 platforms a join table is more friction than it's worth. If the platform list crosses ~8 we'll revisit.

### Fetcher

A fetcher pulls source clips from one place. All fetchers expose:

```js
export async function fetch(query, opts) {
  // returns: [{ url, durationSec, license, attribution, sourceId, ... }, ...]
}
```

Initial fetchers: `pexels`, `pixabay`, `archive-org`, `ai-video` (Runway/Veo), `manual-upload` (reads from R2 `reels-inbox` bucket).

### Renderer

A renderer takes a ContentItem + channel config and produces an MP4. The first renderer is `reel.js` — short-form (15-60s), hard-cut between clips. It is **mode-aware** via `rendererConfig.mode`:

| Mode | Narration | Captions | Voice speed | Notes |
|---|---|---|---|---|
| `factual`   | ✓ Claude-generated | ✓ Whisper-derived | 1.00× | News-style hook + 3 facts + CTA |
| `cinematic` | ✓ Claude-generated | ✓ Whisper-derived | 0.85× | Evocative, atmospheric. Music louder. |
| `listicle`  | ✓ Claude-generated | ✓ Whisper-derived | 1.05× | Countdown N→1, snappy |
| `silent`    | ✗ skipped          | ✗ skipped         | n/a    | Visuals + music only, CTA appears in last 4s |

All modes share clip concat (9:16, scale + crop), watermark, two-line CTA overlay, and FFmpeg with libx264/aac/faststart.

The news pipeline's `documentary.js` is in the same family but lives in the news repo. If/when reels need long-form, port it (copy, don't import).

### Publisher

A publisher posts a rendered MP4 to one platform. All publishers expose:

```js
export async function publish(contentItem, channelConfig) {
  // returns: { postId, postedAt, platformUrl }
  // throws on failure with structured error
}

export const capabilities = {
  maxDurationSec, aspectRatios, maxFileSizeMB, supportsScheduling
};
```

`publishers/index.js` exposes `publishToAll(contentItem, channelConfig)` which fans out across enabled platforms. Failures are isolated per-platform — one broken token doesn't stop the others.

## Data flow

```
   ┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
   │  ingest  │ →  │  claude  │ →  │  render  │ →  │ publish  │
   └──────────┘    └──────────┘    └──────────┘    └──────────┘
        │              │                │                │
        │              │                │                │
   fetchers/      services/         renderers/      services/
   *.js           claude.js         reel.js         publishers/*.js
        │              │                │                │
        ▼              ▼                ▼                ▼
   source_clips    narration       rendered_video    fb/ig/yt/tt
   stored in DB    + caption       uploaded to R2    post IDs in DB
                   in DB           URL in DB
```

Each step is its own CLI script (`src/scripts/*.js`) so the operator can re-run any phase independently. `pipeline.js` chains them for cron runs.

## Storage layout

| Asset | Where | Why |
|---|---|---|
| Content metadata | Supabase `content_items` | Cheap, queryable, indexed |
| Rendered MP4s | Cloudflare R2 `reels-rendered` | 10GB free, zero egress, public URLs |
| Manually-uploaded clips | Cloudflare R2 `reels-inbox` | Fetched by `manual-upload.js` |
| Downloaded source clips | `/tmp/reels/` (ephemeral) | Re-fetched from origin if needed |
| Render artifacts (TTS WAVs, etc.) | `/tmp/reels/<id>/` (cached during render) | Lets retries skip TTS |

**No video files in Supabase Storage.** A single GB of MP4s would eat the entire free quota.

## Multi-platform handling

| Platform | API | Auth | Format constraints |
|---|---|---|---|
| Facebook  | Graph API v22.0  | Long-lived Page token | 9:16, ≤90s for Reels, ≤4GB |
| Instagram | Graph API v22.0  | IG-linked Business account on same Page | 9:16, 3-90s, ≤100MB |
| YouTube   | YouTube Data API v3 | OAuth2 + refresh token | 9:16, ≤60s for Shorts, ≤256GB |
| TikTok    | Content Posting API | Access token (app review required) | 9:16, 3-600s, ≤500MB |

The renderer targets the strictest common denominator: 9:16 at 1080x1920, ≤60s, ≤90MB. That clip passes all four platforms without re-encoding.

## Milestones

### M1 — Schema + skeleton (this scaffold)
Repo + DB migration + channel registry + .env.example. No working pipeline. **(current state)**

### M2 — Wildlife on Facebook — **IN PROGRESS (render leg complete)**
- ✅ Pexels fetcher (verified 2026-05-26 — 14 clips → 5 selected)
- ✅ Claude narration + caption + hashtag generation (verified with Opus 4.7 via oneprovider.dev; needed worked-example in prompt before Opus stopped inventing extra keys)
- ✅ `reel.js` renderer: clip concat + TTS + Whisper captions + music + watermark + CTA (verified — content_item 1 → output/reels/1.mp4, 18.9s, 1080x1920 9:16)
- ✅ R2 upload made optional in generate-reel (graceful skip when env vars missing)
- ✅ CLI scripts: `ingest`, `generate-reel`, `publish` all wired
- ✅ R2 storage adapter — bucket provisioned, upload verified end-to-end (2026-05-26)
- ⏸️ Facebook publisher — code written, **API automation deferred** (2026-05-26). User chose manual upload for initial reels. Revisit once content cadence justifies API automation.
- **Exit criteria:** one wildlife reel rendered and posted to a real FB page. (Render: ✅. R2 hosting: ✅. Publish: manual for now, API publish deferred.)

### M3 — Instagram Reels
Same Graph API as FB. New publisher file, ~1 day of work including IG container/publish dance.

### M4 — Dashboard extension
Extend the existing Angular dashboard (in `../facebook-news-pipeline/dashboard/`) with niche + platform filters. Read `content_items` alongside `articles`.

### M5 — YouTube Shorts
OAuth2 setup, Data API v3 client, separate metadata model (title/description/tags).

### M6 — TikTok
Content Posting API + app review submission. Last because of the gating.

### M7+ — Niche #2, AI video fetchers, scheduling
Open. Decide based on what M2-M6 teaches.

## Decisions log

| Date | Decision | Rationale |
|---|---|---|
| 2026-05-26 | Separate repo from news pipeline | Domains diverge: video vs text+image, multi-platform vs single. Coupling costs more than DRY saves. |
| 2026-05-26 | Same Supabase project | Free-tier DB is plentiful for metadata; one dashboard reads both. |
| 2026-05-26 | Cloudflare R2 for video storage | Supabase free Storage too small; R2 has 10GB free + zero egress, purpose-built. |
| 2026-05-26 | `niche/style/LANG` channel key | Three-dimensional key — niche, style, language. Each (style) gets its own channel so the renderer + audience are coherent; multiple channels can share an FB Page via shared `envKey`. |
| 2026-05-26 | 4 styles → 2 FB Pages | NaturePulse carries factual + listicle; NatureFrame carries cinematic + silent. Cuts ops overhead in half vs 4 pages while preserving clean brand voice per page. |
| 2026-05-26 | Worked-example in Claude system prompt | Opus 4.7 freelanced into a richer schema (per-clip voiceover, editing notes, etc.) until we added a complete example response + explicit DO-NOT-add-these-keys list. Schema-by-example is more reliable than schema-by-description with Opus. |
| 2026-05-26 | `description` is nice-to-have, not required | Opus consistently omitted it; we derive from `title` when missing. Avoids fighting the model on a field that adds little signal. |
| 2026-05-26 | FB API publish deferred — manual upload first | Decision was to validate content quality + engagement before investing in FB Developer app setup, Page tokens, and rate-limit handling. The publisher code is written and tested-by-shape; activating it is later flip-the-switch work, not new development. Workflow until then: render via `generate-reel.js`, upload from R2 URL via FB's web uploader. |
| 2026-05-26 | Per-platform status columns, not a publications table | Simpler at 4 platforms. Revisit if platform list grows. |
| 2026-05-26 | Don't pre-extract shared code from news repo | Duplicate first, extract when a second consumer actually exists. |
