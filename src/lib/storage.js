import { supabase } from './supabase';

/**
 * Refreshes the Supabase session if the current token is expired or about to expire.
 * This prevents "exp claim timestamp check failed" errors during Storage uploads.
 */
const ensureFreshSession = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return; // anonymous / not logged in

    // If the token expires within the next 60 seconds, refresh it
    const expiresAt = session.expires_at; // Unix timestamp in seconds
    const nowSec = Math.floor(Date.now() / 1000);
    if (expiresAt && expiresAt - nowSec < 60) {
        const { error } = await supabase.auth.refreshSession();
        if (error) {
            console.warn('Session refresh failed, the upload may fail:', error.message);
        }
    }
};

/**
 * Uploads a file to a specific Supabase storage bucket
 * @param {string} bucket - The name of the bucket (e.g., 'portfolio-images')
 * @param {File} file - The file object to upload
 * @param {string} path - The destination path/filename inside the bucket
 * @returns {Promise<{path: string, error: any}>}
 */
export const uploadFile = async (bucket, file, path) => {
    // Sanitize path: replace spaces and special characters but keep slashes, dots and dashes
    const sanitizedPath = path.replace(/[^\w\/\.\-]/g, '_');

    try {
        // Ensure the auth token is still valid before uploading
        await ensureFreshSession();

        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(sanitizedPath, file, {
                cacheControl: '3600',
                upsert: false
            });

        if (error) throw error;
        return { path: data.path, error: null };

    } catch (error) {
        console.error(`Error uploading to ${bucket}:`, error);
        return { path: null, error };
    }
};

/**
 * Gets the public URL for a file in a Supabase storage bucket
 * @param {string} bucket - The name of the bucket
 * @param {string} path - The path/filename inside the bucket
 * @returns {string} The public URL
 */
export const getPublicUrl = (bucket, path) => {
    if (!path) return '';
    const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

    return data.publicUrl;
};

/**
 * Deletes a file from a Supabase storage bucket
 * @param {string} bucket - The name of the bucket
 * @param {string} path - The path/filename inside the bucket
 * @returns {Promise<{success: boolean, error: any}>}
 */
export const deleteFile = async (bucket, path) => {
    try {
        await ensureFreshSession();

        const { error } = await supabase.storage
            .from(bucket)
            .remove([path]);

        if (error) throw error;
        return { success: true, error: null };
    } catch (error) {
        console.error(`Error deleting from ${bucket}:`, error);
        return { success: false, error };
    }
};
