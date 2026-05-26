// Channel registry. Channel key = `niche/style/LANG`.
//
// `envKey` is the suffix used to look up per-platform credentials in .env.
// Multiple channels can share an envKey when they publish to the same page.
//
// Adding a new channel = add a block here. No other code changes needed.

export const CHANNELS = {
  // ── Wildlife Daily page (factual + listicle) ──────────────────────────────
  'wildlife/factual/EN': {
    niche: 'wildlife',
    style: 'factual',
    language: 'en',
    contentLanguage: 'English',
    fetchers: [
      { type: 'pexels', query: 'wildlife animals nature', perPage: 15, orientation: 'portrait', minDuration: 6 },
    ],
    renderer: 'reel',
    rendererConfig: {
      mode: 'factual',
      durationSec: 30,
      clipsPerReel: 5,
      aspectRatio: '9:16',
      resolution: '1080x1920',
      music: 'nature_uplifting.mp3',
      musicVolume: 0.10,
      voice: 'af_bella',
      voiceSpeed: 1.0,
      captions: true,
      narration: true,
      cta: { line1: 'FOLLOW FOR MORE', line2: 'Wildlife Daily' },
    },
    platforms: {
      facebook:  { envKey: 'WILDLIFE_DAILY', enabled: true  },
      instagram: { envKey: 'WILDLIFE_DAILY', enabled: false },
      youtube:   { envKey: 'WILDLIFE_DAILY', enabled: false },
      tiktok:    { envKey: 'WILDLIFE_DAILY', enabled: false },
    },
    watermarkFile: 'WildlifeDaily_Logo.png',
    pageName: 'Wildlife Daily',
  },

  'wildlife/listicle/EN': {
    niche: 'wildlife',
    style: 'listicle',
    language: 'en',
    contentLanguage: 'English',
    fetchers: [
      { type: 'pexels', query: 'wildlife animals close up', perPage: 15, orientation: 'portrait', minDuration: 5 },
    ],
    renderer: 'reel',
    rendererConfig: {
      mode: 'listicle',
      durationSec: 30,
      clipsPerReel: 5,
      aspectRatio: '9:16',
      resolution: '1080x1920',
      music: 'upbeat_pop.mp3',
      musicVolume: 0.12,
      voice: 'af_bella',
      voiceSpeed: 1.05,
      captions: true,
      narration: true,
      cta: { line1: 'FOLLOW FOR MORE', line2: 'Wildlife Daily' },
    },
    platforms: {
      facebook:  { envKey: 'WILDLIFE_DAILY', enabled: true  },
      instagram: { envKey: 'WILDLIFE_DAILY', enabled: false },
      youtube:   { envKey: 'WILDLIFE_DAILY', enabled: false },
      tiktok:    { envKey: 'WILDLIFE_DAILY', enabled: false },
    },
    watermarkFile: 'WildlifeDaily_Logo.png',
    pageName: 'Wildlife Daily',
  },

  // ── Wild Cinema page (cinematic + silent) ─────────────────────────────────
  'wildlife/cinematic/EN': {
    niche: 'wildlife',
    style: 'cinematic',
    language: 'en',
    contentLanguage: 'English',
    fetchers: [
      { type: 'pexels', query: 'wildlife slow motion cinematic', perPage: 15, orientation: 'portrait', minDuration: 8 },
    ],
    renderer: 'reel',
    rendererConfig: {
      mode: 'cinematic',
      durationSec: 45,
      clipsPerReel: 5,
      aspectRatio: '9:16',
      resolution: '1080x1920',
      music: 'cinematic_epic.mp3',
      musicVolume: 0.14,
      voice: 'af_bella',
      voiceSpeed: 0.85,
      captions: true,
      narration: true,
      cta: { line1: 'FOLLOW FOR MORE', line2: 'Wild Cinema' },
    },
    platforms: {
      facebook:  { envKey: 'WILD_CINEMA', enabled: true  },
      instagram: { envKey: 'WILD_CINEMA', enabled: false },
      youtube:   { envKey: 'WILD_CINEMA', enabled: false },
      tiktok:    { envKey: 'WILD_CINEMA', enabled: false },
    },
    watermarkFile: 'WildCinema_Logo.png',
    pageName: 'Wild Cinema',
  },

  'wildlife/silent/EN': {
    niche: 'wildlife',
    style: 'silent',
    language: 'en',
    contentLanguage: 'English',
    fetchers: [
      { type: 'pexels', query: 'wildlife nature serene', perPage: 15, orientation: 'portrait', minDuration: 8 },
    ],
    renderer: 'reel',
    rendererConfig: {
      mode: 'silent',
      durationSec: 30,
      clipsPerReel: 5,
      aspectRatio: '9:16',
      resolution: '1080x1920',
      music: 'nature_ambient.mp3',
      musicVolume: 0.35,
      voice: null,
      voiceSpeed: null,
      captions: false,
      narration: false,
      cta: { line1: 'FOLLOW FOR MORE', line2: 'Wild Cinema' },
    },
    platforms: {
      facebook:  { envKey: 'WILD_CINEMA', enabled: true  },
      instagram: { envKey: 'WILD_CINEMA', enabled: false },
      youtube:   { envKey: 'WILD_CINEMA', enabled: false },
      tiktok:    { envKey: 'WILD_CINEMA', enabled: false },
    },
    watermarkFile: 'WildCinema_Logo.png',
    pageName: 'Wild Cinema',
  },
};

export function getChannel(key) {
  const ch = CHANNELS[key];
  if (!ch) throw new Error(`Unknown channel: ${key}. Known: ${Object.keys(CHANNELS).join(', ')}`);
  return ch;
}

export function listEnabledPlatforms(channel) {
  return Object.entries(channel.platforms)
    .filter(([_, cfg]) => cfg.enabled)
    .map(([platform]) => platform);
}
