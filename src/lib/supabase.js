import { createClient } from '@supabase/supabase-js';

// Get environment variables from Vite (must start with VITE_)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validation: warn if env variables are missing
if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('⚠️ VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing!');
    console.warn('   Create a .env file with these variables (not .env.example)');
}

// Use fallback values for development (replace with your actual credentials)
const finalUrl = supabaseUrl || 'https://kozlzchjgedgcqowyojd.supabase.co';
const finalKey = supabaseAnonKey || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imtvemx6Y2hqZ2VkZ2Nxb3d5b2pkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM1OTExOTAsImV4cCI6MjA4OTE2NzE5MH0.xLOJT23Yxn-1AO3dKJe58XLS99DhF2LBWrMrYCHCM78';

export const supabase = createClient(finalUrl, finalKey);
