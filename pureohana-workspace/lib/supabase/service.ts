import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client with service role privileges
 * This bypasses Row Level Security (RLS) policies
 * USE WITH CAUTION - Only use in secure server-side contexts
 */
export function createServiceClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Missing Supabase service role environment variables')
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  })
}
