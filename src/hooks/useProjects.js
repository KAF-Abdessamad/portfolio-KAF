import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

// Global cache to persist data across mounts during the session
const PROJECTS_CACHE = {
    data: null,
    timestamp: 0,
    TTL: 5 * 60 * 1000 // 5 minutes
};

/**
 * Hook for managing projects with Supabase
 * Features specialized fetchers, real-time sync and simple caching.
 */
export const useProjects = () => {
    const [projects, setProjects] = useState(PROJECTS_CACHE.data || []);
    const [loading, setLoading] = useState(!PROJECTS_CACHE.data);
    const [error, setError] = useState(null);

    const isCacheFresh = () => {
        return PROJECTS_CACHE.data && (Date.now() - PROJECTS_CACHE.timestamp < PROJECTS_CACHE.TTL);
    };

    /**
     * Fetch all projects from Supabase
     */
    const fetchProjects = useCallback(async (force = false) => {
        if (!force && isCacheFresh()) {
            setProjects(PROJECTS_CACHE.data);
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            const { data, error: pbError } = await supabase
                .from('projects')
                .select('*')
                .order('order_index', { ascending: true });

            if (pbError) throw pbError;

            // Update cache
            PROJECTS_CACHE.data = data || [];
            PROJECTS_CACHE.timestamp = Date.now();

            setProjects(PROJECTS_CACHE.data);
        } catch (err) {
            console.error("Error fetching projects:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Returns only featured projects
     */
    const fetchFeatured = useCallback(() => {
        return projects.filter(p => p.featured);
    }, [projects]);

    /**
     * Filters projects by category locally
     */
    const filterByCategory = useCallback((category) => {
        if (!category || category === 'All') return projects;
        return projects.filter(p => p.category === category);
    }, [projects]);

    useEffect(() => {
        fetchProjects();

        // Subscribe to real-time changes
        const subscription = supabase
            .channel('projects-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, () => {
                // On any change, refetch to ensure order_index and state is perfect
                fetchProjects(true);
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [fetchProjects]);

    return {
        projects,
        loading,
        error,
        fetchProjects: () => fetchProjects(true), // Expose manual refresh
        fetchFeatured,
        filterByCategory
    };
};

