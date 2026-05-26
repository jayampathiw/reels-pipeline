import { spawn } from 'child_process';
import { mkdirSync, existsSync, createWriteStream } from 'fs';
import { resolve, dirname, join } from 'path';
import { fileURLToPath } from 'url';
import axios from 'axios';

const __dirname  = dirname(fileURLToPath(import.meta.url));
const ROOT       = resolve(__dirname, '../..');
const TTS_SCRIPT = resolve(__dirname, 'tts.py');
const FONT       = resolve(ROOT, 'assets/fonts/Anton-Regular.ttf');
const LOGOS_DIR  = resolve(ROOT, 'assets/logos');
const MUSIC_DIR  = resolve(ROOT, 'assets/music');
const OUTPUT_DIR = resolve(ROOT, 'output/reels');

const TAIL = 2; // extra seconds after voice ends for CTA display

// ── ffmpeg helpers ───────────────────────────────────────────────────────────

function run(cmd, args, label) {
  return new Promise((res, rej) => {
    const p = spawn(cmd, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    p.stdout.on('data', d => process.stdout.write(`[${label}] ${d}`));
    p.stderr.on('data', d => process.stderr.write(`[${label}] ${d}`));
    p.on('close', code => code === 0 ? res() : rej(new Error(`${label} exited with code ${code}`)));
    p.on('error', rej);
  });
}

function ffprobeDuration(filePath) {
  return new Promise((res, rej) => {
    const p = spawn('ffprobe', ['-i', filePath, '-show_entries', 'format=duration', '-v', 'quiet', '-of', 'csv=p=0']);
    let out = '';
    p.stdout.on('data', d => { out += d; });
    p.on('close', () => res(parseFloat(out.trim()) || 0));
    p.on('error', rej);
  });
}

function escapeText(s) {
  return (s || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/:/g, '\\:');
}

async function downloadFile(url, destPath) {
  const writer = createWriteStream(destPath);
  const res = await axios.get(url, { responseType: 'stream', timeout: 120_000 });
  await new Promise((resolveDl, reject) => {
    res.data.pipe(writer);
    writer.on('finish', resolveDl);
    writer.on('error', reject);
    res.data.on('error', reject);
  });
}

function assertAsset(path, label) {
  if (!existsSync(path)) {
    throw new Error(`Missing ${label}: ${path}\nPlace the file at this path and re-run.`);
  }
}

// ── Main export ──────────────────────────────────────────────────────────────

export async function renderReel(contentItem, channel) {
  const cfg = channel.rendererConfig;
  const { mode, durationSec: targetDur, clipsPerReel, music, musicVolume, voice, voiceSpeed, captions, narration, cta } = cfg;
  const watermarkPath = join(LOGOS_DIR, channel.watermarkFile);
  const musicPath     = join(MUSIC_DIR, music);

  const workDir = `/tmp/reels/${contentItem.id}`;
  const outPath = join(OUTPUT_DIR, `${contentItem.id}.mp4`);
  mkdirSync(workDir, { recursive: true });
  mkdirSync(OUTPUT_DIR, { recursive: true });

  assertAsset(musicPath, `music file (assets/music/${music})`);
  assertAsset(watermarkPath, `watermark (assets/logos/${channel.watermarkFile})`);
  assertAsset(FONT, 'font (assets/fonts/Anton-Regular.ttf)');

  // ── 1. Download source clips ───────────────────────────────────────────────
  const clips = (contentItem.source_clips || []).slice(0, clipsPerReel);
  if (clips.length === 0) throw new Error(`Content item ${contentItem.id} has no source_clips`);

  const clipPaths = [];
  for (let i = 0; i < clips.length; i++) {
    const p = join(workDir, `clip_${i}.mp4`);
    if (existsSync(p)) {
      console.log(`[reel] clip ${i + 1}/${clips.length} — reusing cached`);
    } else {
      console.log(`[reel] downloading clip ${i + 1}/${clips.length}...`);
      await downloadFile(clips[i].url, p);
    }
    clipPaths.push(p);
  }

  // ── 2. Narration (if enabled) ──────────────────────────────────────────────
  let voicePath = null;
  let srtPath   = null;
  let voiceDur  = 0;

  if (narration) {
    if (!contentItem.narration_script) {
      throw new Error(`narration enabled but content item ${contentItem.id} has no narration_script`);
    }
    voicePath = join(workDir, 'voice.wav');
    if (!existsSync(voicePath)) {
      console.log('[reel] TTS narration...');
      await run('python3', [TTS_SCRIPT, contentItem.narration_script, voice, voicePath, String(voiceSpeed)], 'tts');
    } else {
      console.log('[reel] TTS narration — reusing cached');
    }
    voiceDur = await ffprobeDuration(voicePath);
    console.log(`[reel]   voice duration: ${voiceDur.toFixed(1)}s`);

    if (captions) {
      srtPath = join(workDir, 'voice.srt');
      if (!existsSync(srtPath)) {
        console.log('[reel] subtitles via whisper...');
        await run('whisper', [voicePath, '--model', 'tiny', '--language', 'en', '--output_dir', workDir, '--output_format', 'srt', '--word_timestamps', 'True'], 'whisper');
      } else {
        console.log('[reel] subtitles — reusing cached');
      }
    }
  }

  // Total reel duration: narration drives it when present, otherwise fixed targetDur
  const totalDur = narration ? voiceDur + TAIL : targetDur;

  // ── 3. Plan clip cuts so they sum to totalDur ─────────────────────────────
  const perClip = totalDur / clipPaths.length;
  console.log(`[reel] total ${totalDur.toFixed(1)}s, ${clipPaths.length} clips × ${perClip.toFixed(1)}s each`);

  // ── 4. FFmpeg composition ──────────────────────────────────────────────────
  const ffInputs = [];
  for (let i = 0; i < clipPaths.length; i++) {
    ffInputs.push('-i', clipPaths[i]);
  }
  const voiceIdx = clipPaths.length;
  const logoIdx  = clipPaths.length + (voicePath ? 1 : 0);
  const musicIdx = logoIdx + 1;

  if (voicePath) ffInputs.push('-i', voicePath);
  ffInputs.push('-i', watermarkPath);
  ffInputs.push('-stream_loop', '-1', '-i', musicPath);

  const f = [];

  // Scale + crop each clip to 1080x1920 and trim to perClip seconds
  for (let i = 0; i < clipPaths.length; i++) {
    f.push(`[${i}:v]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,setsar=1,trim=duration=${perClip.toFixed(3)},setpts=PTS-STARTPTS[vr${i}]`);
  }

  // Concat all clips
  const concatInputs = Array.from({ length: clipPaths.length }, (_, i) => `[vr${i}]`).join('');
  f.push(`${concatInputs}concat=n=${clipPaths.length}:v=1:a=0[vconcat]`);

  // Burn subtitles (captions modes only)
  let vCurrent = 'vconcat';
  if (srtPath) {
    const srtEsc = srtPath.replace(/\\/g, '/').replace(/:/g, '\\:');
    const subStyle = 'FontName=Arial,FontSize=14,PrimaryColour=&H00FFFFFF,OutlineColour=&H00000000,Outline=2,MarginV=120,MarginL=40,MarginR=40,Alignment=2';
    f.push(`[${vCurrent}]subtitles='${srtEsc}':force_style='${subStyle}'[vsub]`);
    vCurrent = 'vsub';
  }

  // Watermark (bottom-right, 110px wide)
  f.push(`[${logoIdx}:v]scale=110:-1[logo]`);
  f.push(`[${vCurrent}][logo]overlay=x=W-w-32:y=H-h-32:format=auto[vwm]`);
  vCurrent = 'vwm';

  // CTA overlay — appears after voice ends (narration modes) or after 60% of duration (silent)
  if (narration) {
    const ctaEnable = `gt(t\\,${voiceDur.toFixed(2)})`;
    const cta1 = escapeText(cta.line1);
    const cta2 = escapeText(cta.line2);
    f.push(`[${vCurrent}]drawtext=fontfile=${FONT}:text=${cta1}:fontsize=68:fontcolor=white:x=(w-tw)/2:y=(h/2)-50:borderw=3:bordercolor=black@0.85:enable=${ctaEnable}[vc1]`);
    f.push(`[vc1]drawtext=fontfile=${FONT}:text=${cta2}:fontsize=46:fontcolor=white:x=(w-tw)/2:y=(h/2)+30:borderw=3:bordercolor=black@0.85:enable=${ctaEnable}[vout]`);
  } else {
    // silent mode: CTA appears in the last 4 seconds
    const ctaStart = Math.max(0, totalDur - 4);
    const ctaEnable = `gt(t\\,${ctaStart.toFixed(2)})`;
    const cta1 = escapeText(cta.line1);
    const cta2 = escapeText(cta.line2);
    f.push(`[${vCurrent}]drawtext=fontfile=${FONT}:text=${cta1}:fontsize=68:fontcolor=white:x=(w-tw)/2:y=(h/2)-50:borderw=3:bordercolor=black@0.85:enable=${ctaEnable}[vc1]`);
    f.push(`[vc1]drawtext=fontfile=${FONT}:text=${cta2}:fontsize=46:fontcolor=white:x=(w-tw)/2:y=(h/2)+30:borderw=3:bordercolor=black@0.85:enable=${ctaEnable}[vout]`);
  }

  // Audio
  const fadeOutAt = Math.max(0, totalDur - 2);
  if (voicePath) {
    f.push(`[${voiceIdx}:a]apad=pad_dur=${TAIL}[vpad]`);
    f.push(`[${musicIdx}:a]volume=${musicVolume},afade=t=in:st=0:d=1.5,afade=t=out:st=${fadeOutAt.toFixed(2)}:d=2[music]`);
    f.push(`[vpad][music]amix=inputs=2:duration=first[aout]`);
  } else {
    // silent mode: just music
    f.push(`[${musicIdx}:a]volume=${musicVolume},afade=t=in:st=0:d=1.5,afade=t=out:st=${fadeOutAt.toFixed(2)}:d=2[aout]`);
  }

  console.log('[reel] FFmpeg compositing...');
  await run('ffmpeg', [
    '-y',
    ...ffInputs,
    '-filter_complex', f.join(';'),
    '-map', '[vout]', '-map', '[aout]',
    '-t', String(totalDur),
    '-r', '30',
    '-c:v', 'libx264', '-preset', 'fast', '-crf', '22',
    '-c:a', 'aac', '-b:a', '192k',
    '-movflags', '+faststart',
    '-pix_fmt', 'yuv420p',
    outPath,
  ], 'ffmpeg');

  const finalDur = await ffprobeDuration(outPath);
  console.log(`[reel] Done → ${outPath} (${finalDur.toFixed(1)}s)`);

  return { outputPath: outPath, durationSec: Math.round(finalDur) };
}
