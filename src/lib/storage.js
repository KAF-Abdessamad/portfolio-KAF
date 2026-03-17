import { supabase } from './supabase';

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
