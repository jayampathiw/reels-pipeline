// End-to-end orchestrator: ingest → generate-reel → publish for one channel.
// Mostly useful for cron schedules. The individual CLI scripts under src/scripts/
// run each step independently, which is what you want for debugging.
//
// Usage: node src/pipeline.js <channel_key>

import 'dotenv/config';
import { spawn } from 'child_process';

function run(node, args, label) {
  return new Promise((resolve, reject) => {
    const p = spawn(node, args, { stdio: 'inherit' });
    p.on('close', code => code === 0 ? resolve() : reject(new Error(`${label} exited ${code}`)));
    p.on('error', reject);
  });
}

async function captureId(args) {
  return new Promise((resolve, reject) => {
    const p = spawn('node', args, { stdio: ['ignore', 'pipe', 'inherit'] });
    let buf = '';
    p.stdout.on('data', d => { buf += d; process.stdout.write(d); });
    p.on('close', code => {
      if (code !== 0) return reject(new Error(`ingest exited ${code}`));
      const m = buf.match(/content_item id=(\d+)/);
      if (!m) return reject(new Error('could not parse content_item id from ingest output'));
      resolve(m[1]);
    });
    p.on('error', reject);
  });
}

async function main() {
  const channelKey = process.argv[2];
  if (!channelKey) {
    console.error('Usage: node src/pipeline.js <channel_key>');
    process.exit(1);
  }

  const id = await captureId(['src/scripts/ingest.js', channelKey]);
  await run('node', ['src/scripts/generate-reel.js', id], 'generate-reel');
  await run('node', ['src/scripts/publish.js', id], 'publish');

  console.log(`\n[pipeline] complete — content_item ${id} posted`);
}

main().catch(e => { console.error('[pipeline]', e.message); process.exit(1); });
