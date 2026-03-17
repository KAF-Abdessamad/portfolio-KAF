/**
 * Environment variables configuration
 * Exposes strictly typed constants from Vite's import.meta.env
 */

export const ENV = {
    // Supabase
    SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || '',
    SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || '',

    // EmailJS
    EMAILJS_SERVICE_ID: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
    EMAILJS_TEMPLATE_ID: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
    EMAILJS_PUBLIC_KEY: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
};

// Simple validation to warn if Supabase keys are missing
if (!ENV.SUPABASE_URL || !ENV.SUPABASE_ANON_KEY) {
    console.warn("⚠️ Supabase environment variables are missing. Please check your .env file.");
}
