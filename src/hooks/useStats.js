import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook to track a page visit silently
 * Call this inside a high-level component like App.jsx or Layout
 */
export const useTrackVisit = (pageName) => {
    useEffect(() => {
        const trackVisit = async () => {
            try {
                // Ignore if Supabase URL isn't configured yet
                if (!import.meta.env.VITE_SUPABASE_URL) return;

                // Simple anonymized tracking (optional: add real device/country parsing if needed)
                let visitorId = localStorage.getItem('visitor_id');
                if (!visitorId) {
                    visitorId = crypto.randomUUID();
                    localStorage.setItem('visitor_id', visitorId);
                }

                await supabase.from('stats').insert([
                    {
                        page: pageName,
                        visitor_id: visitorId,
                        device: /Mobi|Android/i.test(navigator.userAgent) ? 'Mobile' : 'Desktop',
                    }
                ]);
            } catch (error) {
                // Fail silently, stats tracking shouldn't break the app
            }
        };

        trackVisit();
    }, [pageName]);
};

/**
 * Admin view: Fetch aggregated stats
 */
export const useStats = () => {
    const [stats, setStats] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchStats = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error: pbError } = await supabase
                .from('stats')
                .select('*')
                .order('created_at', { ascending: false });

            if (pbError) throw pbError;
            setStats(data || []);
        } catch (err) {
            console.error("Error fetching stats:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    return { stats, loading, error, refresh: fetchStats };
};
