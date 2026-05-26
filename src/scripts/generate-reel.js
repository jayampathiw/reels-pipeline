// CLI: render the MP4 for one or more content_items.
//
//   1. Loads the content_item from Supabase.
//   2. Generates AI narration + caption + hashtags via Claude.
//   3. Runs the renderer (TTS + Whisper + FFmpeg).
//   4. Uploads the rendered MP4 to R2.
//   5. Updates content_item with all generated fields + rendered_video_url.
//
// Usage: node src/scripts/generate-reel.js <id> [<id> ...]

import 'dotenv/config';
import { getChannel } from '../config/channels.js';
import { getContentItem, updateContentItem } from '../services/supabase.js';
import { generateReelContent } from '../services/claude.js';
import { uploadRenderedVideo } from '../services/storage.js';
import { renderReel } from '../renderers/reel.js';

async function processOne(id) {
  console.log(`\n══ content_item ${id} ══`);
  const item = await getContentItem(id);
  const channel = getChannel(item.channel_key);
  const cfg = channel.rendererConfig;

  await updateContentItem(id, { status: 'rendering' });

  // ── 1. Generate AI content (if not already present) ──────────────────────
  let ai = {
    title: item.title,
    description: item.description,
    narration_script: item.narration_script,
    ai_caption: item.ai_caption,
    hashtags: item.hashtags,
  };

  const needsAi = !item.ai_caption || (!item.narration_script && cfg.narration);
  if (needsAi) {
    console.log('[gen] calling Claude...');
    const sourceClipsContext = (item.source_clips || []).map(c => ({
      description: c.description,
      durationSec: c.durationSec,
    }));
    ai = await generateReelContent({
      channelKey: item.channel_key,
      mode: cfg.mode,
      language: channel.contentLanguage,
      pageName: channel.pageName,
      durationSec: cfg.durationSec,
      clipCount: cfg.clipsPerReel,
      topic: channel.niche,
      sourceClipsContext,
    });
    await updateContentItem(id, {
      title: ai.title,
      description: ai.description,
      narration_script: ai.narration_script,
      ai_caption: ai.ai_caption,
      hashtags: ai.hashtags,
    });
  } else {
    console.log('[gen] AI content already present, skipping Claude call');
  }

  const enriched = { ...item, ...ai };

  // ── 2. Render MP4 ─────────────────────────────────────────────────────────
  const { outputPath, durationSec } = await renderReel(enriched, channel);

  // ── 3. Upload to R2 (skip cleanly if not configured) ──────────────────────
  let videoUrl = null;
  if (process.env.R2_ACCOUNT_ID && process.env.R2_PUBLIC_BASE_URL) {
    console.log('[gen] uploading to R2...');
    try {
      videoUrl = await uploadRenderedVideo(outputPath, id);
      console.log(`[gen] uploaded → ${videoUrl}`);
    } catch (e) {
      console.warn(`[gen] R2 upload failed: ${e.message} — keeping local file only`);
    }
  } else {
    console.log('[gen] R2 not configured — skipping upload, local file at:', outputPath);
  }

  // ── 4. Persist render output ──────────────────────────────────────────────
  await updateContentItem(id, {
    rendered_video_url: videoUrl,
    rendered_local_path: outputPath,
    rendered_at: new Date().toISOString(),
    duration_sec: durationSec,
    status: 'rendered',
  });

  console.log(`[gen] content_item ${id} ready to publish`);
  return { id, videoUrl };
}

async function main() {
  const ids = process.argv.slice(2);
  if (ids.length === 0) {
    console.error('Usage: node src/scripts/generate-reel.js <id> [<id> ...]');
    process.exit(1);
  }
  for (const id of ids) {
    try {
      await processOne(id);
    } catch (e) {
      console.error(`[gen] FAILED for id=${id}:`, e.message);
      await updateContentItem(id, { status: 'failed' }).catch(() => {});
    }
  }
}

main().catch(e => { console.error(e); process.exit(1); });
