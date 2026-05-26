import axios from 'axios';

const FB_BASE = 'https://graph.facebook.com/v22.0';

export const capabilities = {
  maxDurationSec: 90,
  aspectRatios: ['9:16'],
  maxFileSizeMB: 4000,
  supportsScheduling: true,
};

// Posts a hosted video to a Facebook Page using the file_url path.
// This is the regular /videos endpoint (not the dedicated /video_reels chunked-upload
// API). Works for vertical videos and they will surface in the page's video tab + feed.
// When we need true Reels-tab placement we'll add a separate publisher in M3+.
export async function publish(contentItem, channelConfig) {
  const envKey = channelConfig.platforms.facebook.envKey;
  const pageId = process.env[`FB_PAGE_ID_${envKey}`];
  const token  = process.env[`FB_ACCESS_TOKEN_${envKey}`];

  if (!pageId || !token) {
    throw new Error(`Missing FB credentials for envKey=${envKey} (FB_PAGE_ID_${envKey}, FB_ACCESS_TOKEN_${envKey})`);
  }
  if (!contentItem.rendered_video_url) {
    throw new Error(`Content item ${contentItem.id} has no rendered_video_url. Run generate-reel first.`);
  }

  const { intro, question, cta } = contentItem.ai_caption || {};
  const captionParts = [intro, question, cta].filter(Boolean);
  const hashtagLine = (contentItem.hashtags || []).map(h => `#${h.replace(/^#/, '')}`).join(' ');
  if (hashtagLine) captionParts.push(hashtagLine);
  const caption = captionParts.join('\n\n');

  const res = await axios.post(`${FB_BASE}/${pageId}/videos`, null, {
    params: {
      file_url: contentItem.rendered_video_url,
      description: caption,
      title: contentItem.title || '',
      access_token: token,
    },
    timeout: 120_000,
  });

  const postId = res.data.id;
  return {
    postId,
    postedAt: new Date(),
    platformUrl: `https://www.facebook.com/${postId}`,
  };
}
