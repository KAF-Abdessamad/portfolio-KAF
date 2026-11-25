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
        logo_url: null,
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
        logo_url: null,
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
        logo_url: null,
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
        logo_url: null,
        order_index: 3,
    },
];

let EXPERIENCES_CACHE = null;

// Helper to save logo in site_settings as resilient backup if logo_url column doesn't exist
async function saveLogoToSettings(experienceId, logoUrl) {
    try {
        const { data } = await supabase.from('site_settings').select('data').eq('id', 'default').maybeSingle();
        const prevData = data?.data || {};
        const logos = prevData.experience_logos || {};
        logos[experienceId] = logoUrl;
        await supabase.from('site_settings').upsert({
            id: 'default',
            data: { ...prevData, experience_logos: logos },
            updated_at: new Date().toISOString()
        });
    } catch (e) {
        console.warn('Could not save logo to site_settings backup:', e);
    }
}

async function getLogosFromSettings() {
    try {
        const { data } = await supabase.from('site_settings').select('data').eq('id', 'default').maybeSingle();
        return data?.data?.experience_logos || {};
    } catch {
        return {};
    }
}

/**
 * Hook for managing the "Expérience / Formation" content with Supabase.
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
            const [{ data: dbData, error: dbError }, logosMap] = await Promise.all([
                supabase.from('experiences').select('*').order('order_index', { ascending: true }),
                getLogosFromSettings()
            ]);

            if (dbError) throw dbError;

            const baseList = (dbData && dbData.length > 0) ? dbData : DEFAULT_EXPERIENCES;
            const merged = baseList.map(item => ({
                ...item,
                logo_url: item.logo_url || logosMap[item.id] || null,
            }));

            EXPERIENCES_CACHE = merged;
            setExperiences(merged);
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
        const itemData = { ...payload, highlights: payload.highlights || [] };
        let insertedId = null;

        // Strip logo_url before sending to Supabase if the column doesn't exist
        const logoUrl = itemData.logo_url;
        const isLogoColumnMissing = (err) =>
            err?.code === '42703' ||
            (err?.message && err.message.includes('logo_url'));

        try {
            const { data, error: dbError } = await supabase
                .from('experiences')
                .insert([itemData])
                .select()
                .single();
            if (dbError) throw dbError;
            insertedId = data?.id;
        } catch (err) {
            if (isLogoColumnMissing(err)) {
                const { logo_url, ...withoutLogo } = itemData;
                const { data, error: dbError2 } = await supabase
                    .from('experiences')
                    .insert([withoutLogo])
                    .select()
                    .single();
                if (dbError2) throw dbError2;
                insertedId = data?.id;
                if (insertedId && logoUrl) {
                    await saveLogoToSettings(insertedId, logoUrl);
                }
            } else {
                throw err;
            }
        }

        await fetchExperiences(true);
        return insertedId;
    }, [fetchExperiences]);

    /**
     * Update an existing experience entry.
     */
    const updateExperience = useCallback(async (id, payload) => {
        const itemData = { ...payload, highlights: payload.highlights || [] };
        const logoUrl = itemData.logo_url;
        const isLogoColumnMissing = (err) =>
            err?.code === '42703' ||
            (err?.message && err.message.includes('logo_url'));

        try {
            const { error: dbError } = await supabase
                .from('experiences')
                .update(itemData)
                .eq('id', id);
            if (dbError) throw dbError;
        } catch (err) {
            if (isLogoColumnMissing(err)) {
                const { logo_url, ...withoutLogo } = itemData;
                const { error: dbError2 } = await supabase
                    .from('experiences')
                    .update(withoutLogo)
                    .eq('id', id);
                if (dbError2) throw dbError2;
                await saveLogoToSettings(id, logoUrl || null);
            } else {
                throw err;
            }
        }

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

    const stages = experiences.filter(e => e.type === 'stage');
    const formations = experiences.filter(e => e.type === 'formation');

    return {
        experiences,
        loading,
        error,
        fetchExperiences,
        addExperience,
        updateExperience,
        deleteExperience,
        stages,
        formations,
        getStages: () => stages,
        getFormations: () => formations,
    };
};
