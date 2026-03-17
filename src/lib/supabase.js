import { createClient } from '@supabase/supabase-js';
import { ENV } from './constants/env';

// Create a single Supabase client for interacting with your database
// Provide a dummy URL/key if not set to prevent immediate crashing during development/build
const supabaseUrl = ENV.SUPABASE_URL || 'https://placeholder-url.supabase.co';
const supabaseAnonKey = ENV.SUPABASE_ANON_KEY || 'placeholder-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
