import { readFile } from 'fs/promises';
import { basename } from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

let _client = null;
function s3() {
  if (!_client) {
    const endpoint = `https://${process.env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
    _client = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
      },
    });
  }
  return _client;
}

function publicUrl(bucket, key) {
  const base = process.env.R2_PUBLIC_BASE_URL?.replace(/\/+$/, '');
  if (!base) {
    throw new Error('R2_PUBLIC_BASE_URL is not set. Configure a public R2 domain so Facebook can fetch the video.');
  }
  return `${base}/${key}`;
}

export async function uploadRenderedVideo(localPath, contentId) {
  const bucket = process.env.R2_BUCKET_RENDERED || 'reels-rendered';
  const key = `reels/${contentId}/${basename(localPath)}`;
  const body = await readFile(localPath);

  await s3().send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: 'video/mp4',
    CacheControl: 'public, max-age=31536000, immutable',
  }));

  return publicUrl(bucket, key);
}

export async function uploadThumbnail(localPath, contentId) {
  const bucket = process.env.R2_BUCKET_RENDERED || 'reels-rendered';
  const key = `reels/${contentId}/${basename(localPath)}`;
  const body = await readFile(localPath);

  await s3().send(new PutObjectCommand({
    Bucket: bucket,
    Key: key,
    Body: body,
    ContentType: 'image/jpeg',
    CacheControl: 'public, max-age=31536000, immutable',
  }));

  return publicUrl(bucket, key);
}
