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
                .single();

            if (pbError && pbError.code !== 'PGRST116') {
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
            // Use rpc for atomic increment if available, or simple update
            // For now, simple update (subject to race conditions but easier to set up)
            const { data: current } = await supabase
                .from('cv')
                .select('download_count')
                .eq('id', cvId)
                .single();

            const { error: upError } = await supabase
                .from('cv')
                .update({ download_count: (current?.download_count || 0) + 1 })
                .eq('id', cvId);

            if (upError) throw upError;

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
