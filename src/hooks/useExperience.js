import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const DEFAULT_EXPERIENCES = [
    // ── Stages ──────────────────────────────────────────────────────────────
    {
        id: 'default-1',
        type: 'stage',
        degree: "Stage Développeur Web Full Stack",
        degree_en: "Full Stack Web Developer Internship",
        school: "Opmobility Lighting Tanger",
        location: "Tanger, Maroc",
        period: "Mars 2025",
        description: "Développement d'une application web Full Stack : conception BD, CRUD avancés, upload d'images, recherche dynamique, auth Laravel, gestion de projet Scrum.",
        description_en: "Full Stack web application development: DB design, advanced CRUD, image upload, dynamic search, Laravel auth, Scrum project management.",
        highlights: ["Laravel 11 / React.js", "Conception BD & MySQL", "CRUD avancés", "Upload d'images", "Auth Laravel", "Axios / API", "Jira / Scrum"],
        highlights_en: ["Laravel 11 / React.js", "DB Design & MySQL", "Advanced CRUD", "Image Upload", "Laravel Auth", "Axios / API", "Jira / Scrum"],
        badge: "Stage",
        badge_en: "Internship",
        order_index: 0,
    },
    {
        id: 'default-2',
        type: 'stage',
        degree: "Stage Développeur Web Full Stack",
        degree_en: "Full Stack Web Developer Internship",
        school: "Office National de l'Électricité et de l'Eau Potable (ONEE)",
        location: "Maroc",
        period: "Mars 2024",
        description: "Système de gestion du parc automobile : CRUD utilisateurs/véhicules/accidents, Import/Export Excel, authentification et sécurisation complète.",
        description_en: "Fleet management system: user/vehicle/accident CRUD, Excel Import/Export, complete authentication and security.",
        highlights: ["Laravel / Blade & React", "MySQL & Eloquent", "Import/Export Excel", "Auth & rôles", "Middleware/CSRF", "Tailwind CSS"],
        highlights_en: ["Laravel / Blade & React", "MySQL & Eloquent", "Excel Import/Export", "Auth & Roles", "Middleware/CSRF", "Tailwind CSS"],
        badge: "Stage",
        badge_en: "Internship",
        order_index: 1,
    },
    // ── Formations ──────────────────────────────────────────────────────────
    {
        id: 'default-3',
        type: 'formation',
        degree: "Cycle d'Ingénieur en Informatique",
        degree_en: "Software Engineering Degree",
        school: "Université Privée de Fès",
        location: "Fès, Maroc",
        period: "Sept. 2025 — en cours",
        description: "Formation d'ingénieur orientée développement logiciel, architecture systèmes et nouvelles technologies.",
        description_en: "Engineering program focused on software development, systems architecture, and new technologies.",
        highlights: ["Génie Informatique", "Architecture logicielle", "Développement Full Stack"],
        highlights_en: ["Software Engineering", "Software Architecture", "Full Stack Development"],
        badge: "Bac+5",
        badge_en: "Master's",
        order_index: 2,
    },
    {
        id: 'default-4',
        type: 'formation',
        degree: "Technicien Spécialisé en Développement Informatique",
        degree_en: "Specialized Technician in Computer Development",
        school: "Centre de Formation et d'Aide à l'Insertion des Jeunes — Fès",
        location: "Fès, Maroc",
        period: "Sept. 2023 — Juil. 2025",
        description: "Formation technique intensive en développement informatique avec projets pratiques.",
        description_en: "Intensive technical training in computer development with practical projects.",
        highlights: ["Développement Web", "Bases de données", "Projets pratiques"],
        highlights_en: ["Web Development", "Databases", "Practical Projects"],
        badge: "Bac+2",
        badge_en: "Associate Degree",
        order_index: 3,
    },
];

let EXPERIENCES_CACHE = null;

/**
 * Hook for managing the "Expérience / Formation" content with Supabase.
 * Falls back to DEFAULT_EXPERIENCES when the table hasn't been created yet.
 */
export const useExperience = () => {
    const [experiences, setExperiences] = useState(EXPERIENCES_CACHE || DEFAULT_EXPERIENCES);
    const [loading, setLoading] = useState(!EXPERIENCES_CACHE);
    const [error, setError] = useState(null);

    const fetchExperiences = useCallback(async (force = false) => {
        if (!force && EXPERIENCES_CACHE) {
            setExperiences(EXPERIENCES_CACHE);
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const { data, error: dbError } = await supabase
                .from('experiences')
                .select('*')
                .order('order_index', { ascending: true });

            if (dbError) throw dbError;

            const result = (data && data.length > 0) ? data : DEFAULT_EXPERIENCES;
            EXPERIENCES_CACHE = result;
            setExperiences(result);
        } catch (err) {
            console.warn('useExperience: falling back to defaults.', err.message);
            setExperiences(DEFAULT_EXPERIENCES);
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Add a new experience entry.
     */
    const addExperience = useCallback(async (payload) => {
        // highlights can be stored as JSON array in Supabase
        const { data, error: dbError } = await supabase
            .from('experiences')
            .insert([{ ...payload, highlights: payload.highlights || [] }])
            .select()
            .single();
        if (dbError) throw dbError;
        await fetchExperiences(true);
        return data;
    }, [fetchExperiences]);

    /**
     * Update an existing experience entry.
     */
    const updateExperience = useCallback(async (id, payload) => {
        const { error: dbError } = await supabase
            .from('experiences')
            .update({ ...payload, highlights: payload.highlights || [] })
            .eq('id', id);
        if (dbError) throw dbError;
        await fetchExperiences(true);
    }, [fetchExperiences]);

    /**
     * Delete an experience entry.
     */
    const deleteExperience = useCallback(async (id) => {
        const { error: dbError } = await supabase
            .from('experiences')
            .delete()
            .eq('id', id);
        if (dbError) throw dbError;
        await fetchExperiences(true);
    }, [fetchExperiences]);

    useEffect(() => {
        fetchExperiences();

        const subscription = supabase
            .channel('experiences-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'experiences' }, () => {
                fetchExperiences(true);
            })
            .subscribe();

        return () => supabase.removeChannel(subscription);
    }, [fetchExperiences]);

    /** Returns only 'formation' type entries, excluding simpler 'Bac' level as requested */
    const getFormations = () => experiences.filter(e => e.type === 'formation' && e.badge?.toLowerCase() !== 'bac');

    /** Returns only 'stage' type entries */
    const getStages = () => experiences.filter(e => e.type === 'stage');

    return {
        experiences,
        loading,
        error,
        fetchExperiences: () => fetchExperiences(true),
        addExperience,
        updateExperience,
        deleteExperience,
        getFormations,
        getStages,
    };
};
