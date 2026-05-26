// CLI: fetch source clips for a channel and insert ONE content_item row.
//
// Usage:
//   node src/scripts/ingest.js <channel_key>
//   node src/scripts/ingest.js wildlife/factual/EN

import 'dotenv/config';
import { getChannel } from '../config/channels.js';
import { insertContentItem } from '../services/supabase.js';
import { newContentItem } from '../utils/content-item.js';
import * as pexels from '../fetchers/pexels.js';

const FETCHERS = { pexels };

async function main() {
  const channelKey = process.argv[2];
  if (!channelKey) {
    console.error('Usage: node src/scripts/ingest.js <channel_key>');
    process.exit(1);
  }

  const channel = getChannel(channelKey);
  console.log(`[ingest] channel: ${channelKey} (${channel.style} mode)`);

  const allClips = [];
  for (const fetcherCfg of channel.fetchers) {
    const fetcher = FETCHERS[fetcherCfg.type];
    if (!fetcher) {
      console.warn(`[ingest] no fetcher for type=${fetcherCfg.type}, skipping`);
      continue;
    }
    console.log(`[ingest] fetching from ${fetcherCfg.type}: query="${fetcherCfg.query}"`);
    const clips = await fetcher.fetch(fetcherCfg);
    console.log(`[ingest]   got ${clips.length} clips`);
    allClips.push(...clips.map(c => ({ ...c, sourceType: fetcherCfg.type, sourceQuery: fetcherCfg.query })));
  }

  if (allClips.length < channel.rendererConfig.clipsPerReel) {
    throw new Error(`Not enough clips (${allClips.length}) to make a reel of ${channel.rendererConfig.clipsPerReel} clips`);
  }

  const chosen = allClips.slice(0, channel.rendererConfig.clipsPerReel);
  const row = newContentItem(
    channelKey,
    channel,
    chosen[0].sourceType,
    chosen[0].sourceQuery,
    chosen,
  );
  const inserted = await insertContentItem(row);
  console.log(`[ingest] created content_item id=${inserted.id} with ${chosen.length} clips`);
  console.log(`[ingest] next: node src/scripts/generate-reel.js ${inserted.id}`);
}

main().catch(e => { console.error(e); process.exit(1); });
