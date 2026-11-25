import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Custom hook to fetch the active CV and handle download tracking
 * @param {string} language - 'fr' | 'en'
 */
export const useCV = (language = 'fr') => {
    const [cvData, setCvData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchActiveCV = async () => {
        try {
            setLoading(true);
            const { data, error: pbError } = await supabase
                .from('cv')
                .select('*')
                .eq('language', language)
                .eq('is_active', true)
                .order('updated_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (pbError) {
                throw pbError;
            }

            setCvData(data || null);
        } catch (err) {
            console.error(`Error fetching CV for ${language}:`, err);
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchActiveCV();
    }, [language]);

    /**
     * Increments the download counter for a specific CV
     * @param {string} cvId - The UUID of the CV
     */
    const trackDownload = async (cvId) => {
        if (!cvId) return;

        try {
            // Atomic increment via security-definer RPC (public UPDATE on cv is denied by RLS)
            const { error: rpcError } = await supabase
                .rpc('increment_cv_download', { cv_id: cvId });

            if (rpcError) throw rpcError;

            // Refresh local state to show updated count
            fetchActiveCV();
        } catch (err) {
            console.error("Error tracking download:", err);
        }
    };

    return {
        cvUrl: cvData?.file_url,
        cvData,
        loading,
        error,
        trackDownload,
        refresh: fetchActiveCV
    };
};
