// Channel registry. Channel key = `niche/style/LANG`.
//
// `envKey` is the suffix used to look up per-platform credentials in .env.
// Multiple channels can share an envKey when they publish to the same page.
//
// Adding a new channel = add a block here. No other code changes needed.

export const CHANNELS = {
  // ── NaturePulse page (factual + listicle) ────────────────────────────────
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
      durationSec: 45,
      clipsPerReel: 7,
      aspectRatio: '9:16',
      resolution: '1080x1920',
      music: 'nature_uplifting.mp3',
      musicVolume: 0.10,
      voice: 'af_bella',
      voiceSpeed: 1.0,
      captions: true,
      narration: true,
      cta: { line1: 'FOLLOW FOR MORE', line2: 'NaturePulse' },
    },
    platforms: {
      facebook:  { envKey: 'NATURE_PULSE', enabled: true  },
      instagram: { envKey: 'NATURE_PULSE', enabled: false },
      youtube:   { envKey: 'NATURE_PULSE', enabled: false },
      tiktok:    { envKey: 'NATURE_PULSE', enabled: false },
    },
    watermarkFile: 'NaturePulse_Logo.png',
    pageName: 'NaturePulse',
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
      durationSec: 45,
      clipsPerReel: 7,
      aspectRatio: '9:16',
      resolution: '1080x1920',
      music: 'upbeat_pop.mp3',
      musicVolume: 0.12,
      voice: 'af_bella',
      voiceSpeed: 1.05,
      captions: true,
      narration: true,
      cta: { line1: 'FOLLOW FOR MORE', line2: 'NaturePulse' },
    },
    platforms: {
      facebook:  { envKey: 'NATURE_PULSE', enabled: true  },
      instagram: { envKey: 'NATURE_PULSE', enabled: false },
      youtube:   { envKey: 'NATURE_PULSE', enabled: false },
      tiktok:    { envKey: 'NATURE_PULSE', enabled: false },
    },
    watermarkFile: 'NaturePulse_Logo.png',
    pageName: 'NaturePulse',
  },

  // ── NatureFrame page (cinematic + silent) ─────────────────────────────────
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
      cta: { line1: 'FOLLOW FOR MORE', line2: 'NatureFrame' },
    },
    platforms: {
      facebook:  { envKey: 'NATURE_FRAME', enabled: true  },
      instagram: { envKey: 'NATURE_FRAME', enabled: false },
      youtube:   { envKey: 'NATURE_FRAME', enabled: false },
      tiktok:    { envKey: 'NATURE_FRAME', enabled: false },
    },
    watermarkFile: 'NatureFrame_Logo.png',
    pageName: 'NatureFrame',
  },

  'wildlife/silent/EN': {
    niche: 'wildlife',
    style: 'silent',
    language: 'en',
    contentLanguage: 'English',
    fetchers: [
      { type: 'pexels', query: 'cute small animals wildlife', perPage: 20, orientation: 'portrait', minDuration: 6 },
    ],
    renderer: 'reel',
    rendererConfig: {
      mode: 'silent',
      durationSec: 45,
      clipsPerReel: 7,
      aspectRatio: '9:16',
      resolution: '1080x1920',
      music: 'nature_ambient.mp3',
      musicVolume: 0.35,
      voice: null,
      voiceSpeed: null,
      captions: false,
      narration: false,
      cta: { line1: 'FOLLOW FOR MORE', line2: 'NatureFrame' },
    },
    platforms: {
      facebook:  { envKey: 'NATURE_FRAME', enabled: true  },
      instagram: { envKey: 'NATURE_FRAME', enabled: false },
      youtube:   { envKey: 'NATURE_FRAME', enabled: false },
      tiktok:    { envKey: 'NATURE_FRAME', enabled: false },
    },
    watermarkFile: 'NatureFrame_Logo.png',
    pageName: 'NatureFrame',
  },

  // ── France Aujourd'hui page (national pride, silent cinematic) ────────────
  'culture/silent/FR': {
    niche: 'culture',
    style: 'silent',
    language: 'fr',
    contentLanguage: 'French',
    fetchers: [
      { type: 'pexels', query: 'Paris France Eiffel Tower landmark architecture', perPage: 20, orientation: 'portrait', minDuration: 5 },
      { type: 'pexels', query: 'France countryside Provence lavender vineyard', perPage: 10, orientation: 'portrait', minDuration: 5 },
    ],
    renderer: 'reel',
    rendererConfig: {
      mode: 'silent',
      durationSec: 45,
      clipsPerReel: 7,
      aspectRatio: '9:16',
      resolution: '1080x1920',
      music: 'cinematic_epic.mp3',
      musicVolume: 0.32,
      voice: null,
      voiceSpeed: null,
      captions: false,
      narration: false,
      cta: { line1: 'SI VOUS AIMEZ LA FRANCE', line2: 'Suivez France Aujourd\'hui' },
      ctaStyle: {
        line1FontColor: 'white',
        line1BorderColor: '0x002395@0.9',      // French blue
        line2FontColor: '0xED2939',             // French red
        line2BorderColor: 'black@0.6',
        subscribeLine: 'ABONNEZ-VOUS',
        subscribeLineFontColor: 'white',
        subscribeLineBorderColor: '0xED2939@0.85',
        animation: 'fadein',
      },
    },
    platforms: {
      facebook:  { envKey: 'FR', enabled: true  },
      instagram: { envKey: 'FR', enabled: false },
      youtube:   { envKey: 'FR', enabled: false },
      tiktok:    { envKey: 'FR', enabled: false },
    },
    watermarkFile: 'FranceAujourdhui_Logo.png',
    pageName: 'France Aujourd\'hui',
  },

  // ── France Aujourd'hui — longer cut, different music ─────────────────────
  'culture/silent/FR-long': {
    niche: 'culture',
    style: 'silent',
    language: 'fr',
    contentLanguage: 'French',
    fetchers: [
      { type: 'pexels', query: 'Mont Saint Michel France island abbey fog tide', perPage: 20, orientation: 'portrait', minDuration: 5 },
      { type: 'pexels', query: 'Paris cafe bistro terrace street fashion people', perPage: 15, orientation: 'portrait', minDuration: 5 },
    ],
    renderer: 'reel',
    rendererConfig: {
      mode: 'silent',
      durationSec: 30,
      clipsPerReel: 5,
      aspectRatio: '9:16',
      resolution: '1080x1920',
      music: 'alternates/paulyudin-inspiring-uplifting-corporate-160692.mp3',
      musicVolume: 0.30,
      voice: null,
      voiceSpeed: null,
      captions: false,
      narration: false,
      cta: { line1: 'SI VOUS AIMEZ LA FRANCE', line2: 'Suivez France Aujourd\'hui' },
      ctaStyle: {
        line1FontColor: 'white',
        line1BorderColor: '0x002395@0.9',
        line2FontColor: '0xED2939',
        line2BorderColor: 'black@0.6',
        subscribeLine: 'ABONNEZ-VOUS',
        subscribeLineFontColor: 'white',
        subscribeLineBorderColor: '0xED2939@0.85',
        animation: 'fadein',
      },
    },
    platforms: {
      facebook:  { envKey: 'FR', enabled: true  },
      instagram: { envKey: 'FR', enabled: false },
      youtube:   { envKey: 'FR', enabled: false },
      tiktok:    { envKey: 'FR', enabled: false },
    },
    watermarkFile: 'FranceAujourdhui_Logo.png',
    pageName: 'France Aujourd\'hui',
  },

  // ── Vivere in Italia — longer cut, different music ────────────────────────
  'culture/silent/IT-long': {
    niche: 'culture',
    style: 'silent',
    language: 'it',
    contentLanguage: 'Italian',
    fetchers: [
      { type: 'pexels', query: 'Cinque Terre Italy colorful village cliff sea coast', perPage: 20, orientation: 'portrait', minDuration: 5 },
      { type: 'pexels', query: 'Venice Italy gondola canal bridge water romance', perPage: 15, orientation: 'portrait', minDuration: 5 },
    ],
    renderer: 'reel',
    rendererConfig: {
      mode: 'silent',
      durationSec: 30,
      clipsPerReel: 5,
      aspectRatio: '9:16',
      resolution: '1080x1920',
      music: 'alternates/paulyudin-documentary-epic-162452.mp3',
      musicVolume: 0.30,
      voice: null,
      voiceSpeed: null,
      captions: false,
      narration: false,
      cta: { line1: 'SE AMI L\'ITALIA', line2: 'Segui Vivere in Italia' },
      ctaStyle: {
        line1FontColor: 'white',
        line1BorderColor: '0x009246@0.9',
        line2FontColor: '0xCE2B37',
        line2BorderColor: 'black@0.6',
        subscribeLine: 'ISCRIVITI',
        subscribeLineFontColor: 'white',
        subscribeLineBorderColor: '0x009246@0.85',
        animation: 'fadein',
      },
    },
    platforms: {
      facebook:  { envKey: 'IT', enabled: true  },
      instagram: { envKey: 'IT', enabled: false },
      youtube:   { envKey: 'IT', enabled: false },
      tiktok:    { envKey: 'IT', enabled: false },
    },
    watermarkFile: 'vivere_in_italia_banner_logo.png',
    pageName: 'Vivere in Italia',
  },

  // ── Vivere in Italia page (national pride, silent cinematic) ──────────────
  'culture/silent/IT': {
    niche: 'culture',
    style: 'silent',
    language: 'it',
    contentLanguage: 'Italian',
    fetchers: [
      { type: 'pexels', query: 'Rome Italy Colosseum architecture Vatican', perPage: 20, orientation: 'portrait', minDuration: 5 },
      { type: 'pexels', query: 'Italy Tuscany Florence Venice canal', perPage: 10, orientation: 'portrait', minDuration: 5 },
    ],
    renderer: 'reel',
    rendererConfig: {
      mode: 'silent',
      durationSec: 45,
      clipsPerReel: 7,
      aspectRatio: '9:16',
      resolution: '1080x1920',
      music: 'cinematic_epic.mp3',
      musicVolume: 0.32,
      voice: null,
      voiceSpeed: null,
      captions: false,
      narration: false,
      cta: { line1: 'SE AMI L\'ITALIA', line2: 'Segui Vivere in Italia' },
      ctaStyle: {
        line1FontColor: 'white',
        line1BorderColor: '0x009246@0.9',      // Italian green
        line2FontColor: '0xCE2B37',             // Italian red
        line2BorderColor: 'black@0.6',
        subscribeLine: 'ISCRIVITI',
        subscribeLineFontColor: 'white',
        subscribeLineBorderColor: '0x009246@0.85',
        animation: 'fadein',
      },
    },
    platforms: {
      facebook:  { envKey: 'IT', enabled: true  },
      instagram: { envKey: 'IT', enabled: false },
      youtube:   { envKey: 'IT', enabled: false },
      tiktok:    { envKey: 'IT', enabled: false },
    },
    watermarkFile: 'vivere_in_italia_banner_logo.png',
    pageName: 'Vivere in Italia',
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
