import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { APP_ENV } from '@/lib/startup-log';

let supabase: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (APP_ENV !== 'production') {
    console.log('[supabase] skipped (non-production)');
    return null;
  }

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    throw new Error('[supabase] missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in production');
  }

  if (!supabase) {
    console.log('[supabase] initializing admin client');
    supabase = createClient(url, key);
  }

  return supabase;
}
