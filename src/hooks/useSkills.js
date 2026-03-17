import { useState, useEffect, useCallback, useMemo } from 'react';
import { supabase } from '../lib/supabase';

/**
 * Hook for managing skills with Supabase
 * Features sorting, grouping, and real-time sync.
 */
export const useSkills = () => {
    const [skills, setSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchSkills = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error: pbError } = await supabase
                .from('skills')
                .select('*')
                .order('order_index', { ascending: true });

            if (pbError) throw pbError;
            setSkills(data || []);
        } catch (err) {
            console.error("Error fetching skills:", err);
            setError(err);
        } finally {
            setLoading(false);
        }
    }, []);

    // Derived states
    const grouped = useMemo(() => {
        return skills.reduce((acc, skill) => {
            const cat = skill.category || 'Other';
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(skill);
            return acc;
        }, {});
    }, [skills]);

    const featuredOnly = useMemo(() => {
        return skills.filter(s => s.featured);
    }, [skills]);

    useEffect(() => {
        fetchSkills();

        const subscription = supabase
            .channel('skills-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'skills' }, () => {
                fetchSkills();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(subscription);
        };
    }, [fetchSkills]);

    /**
     * Filters skills by category
     * @param {string} category 
     */
    const filterByCategory = (category) => {
        if (!category || category === 'All') return skills;
        return skills.filter(s => s.category === category);
    };

    return {
        skills,
        grouped,
        featuredOnly,
        loading,
        error,
        refresh: fetchSkills,
        filterByCategory
    };
};
