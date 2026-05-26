import { createClient } from '@supabase/supabase-js';

let _client = null;
function db() {
  if (!_client) {
    _client = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);
  }
  return _client;
}

const TABLE = 'content_items';

export async function insertContentItem(row) {
  const { data, error } = await db().from(TABLE).insert(row).select().single();
  if (error) throw new Error(`insertContentItem: ${error.message}`);
  return data;
}

export async function getContentItem(id) {
  const { data, error } = await db().from(TABLE).select('*').eq('id', id).single();
  if (error) throw new Error(`getContentItem(${id}): ${error.message}`);
  return data;
}

export async function updateContentItem(id, patch) {
  const { data, error } = await db().from(TABLE).update(patch).eq('id', id).select().single();
  if (error) throw new Error(`updateContentItem(${id}): ${error.message}`);
  return data;
}

export async function listContentItems({ channelKey, status, limit = 50 } = {}) {
  let q = db().from(TABLE).select('*').order('created_at', { ascending: false }).limit(limit);
  if (channelKey) q = q.eq('channel_key', channelKey);
  if (status)     q = q.eq('status', status);
  const { data, error } = await q;
  if (error) throw new Error(`listContentItems: ${error.message}`);
  return data;
}
