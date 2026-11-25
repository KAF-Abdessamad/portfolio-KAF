import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { CONTACT_INFO, SOCIAL_LINKS } from '../lib/constants/contact';

const LOCAL_STORAGE_KEY = 'portfolio-site-settings';

export const DEFAULT_SITE_SETTINGS = {
    profile: {
        fullName: 'Abdessamad KAF',
        email: CONTACT_INFO.email,
        phone: CONTACT_INFO.phone,
        location_fr: 'Fès, Maroc',
        location_en: 'Fez, Morocco',
        githubUrl: SOCIAL_LINKS.find(l => l.icon === 'github')?.url || '',
        linkedinUrl: SOCIAL_LINKS.find(l => l.icon === 'linkedin')?.url || '',
        footerBio_fr: '',
        footerBio_en: '',
    },
    appearance: {
        defaultTheme: 'dark',
        showAvailabilityBadge: true,
        enableGlowEffects: true,
        showSocialLinks: true,
    },
    seo: {
        defaultLanguage: 'fr',
        siteUrl: 'https://portfolio-kaf.vercel.app',
        title_fr: '',
        title_en: '',
        role_fr: '',
        role_en: '',
        description_fr: '',
        description_en: '',
        keywords_fr: '',
        keywords_en: '',
    },
    notifications: {
        emailjsEnabled: true,
        notifyOnContact: true,
        recipientEmail: CONTACT_INFO.email,
    },
    home: {
        hero: {
            available_fr: '',
            available_en: '',
            greeting_fr: '',
            greeting_en: '',
            subtitle_prefix_fr: '',
            subtitle_prefix_en: '',
            subtitles: ['React.js', 'Node.js', 'Laravel', 'Docker', 'Cloud'],
            description_fr: '',
            description_en: '',
            view_projects_fr: '',
            view_projects_en: '',
            download_cv_fr: '',
            download_cv_en: '',
            connect_fr: '',
            connect_en: '',
            profile_image_url: '',
        },
        about: {
            tech_title_fr: '',
            tech_title_en: '',
            tech_subtitle_fr: '',
            tech_subtitle_en: '',
            academic_track_fr: '',
            academic_track_en: '',
            education_title_fr: '',
            education_title_en: '',
            education_accent_fr: '',
            education_accent_en: '',
            education_desc_fr: '',
            education_desc_en: '',
            career_track_fr: '',
            career_track_en: '',
            experience_title_fr: '',
            experience_title_en: '',
            experience_accent_fr: '',
            experience_accent_en: '',
            experience_desc_fr: '',
            experience_desc_en: '',
        },
        projects: {
            title_fr: '',
            title_en: '',
            description_fr: '',
            description_en: '',
        },
        contact: {
            badge_fr: '',
            badge_en: '',
            title_fr: '',
            title_en: '',
            accent_fr: '',
            accent_en: '',
            description_fr: '',
            description_en: '',
            info_title_fr: '',
            info_title_en: '',
            info_subtitle_fr: '',
            info_subtitle_en: '',
        }
    }
};

function deepMerge(target, source) {
    if (!source || typeof source !== 'object' || Array.isArray(source)) {
        return target;
    }
    const output = { ...target };
    for (const key of Object.keys(source)) {
        const sourceVal = source[key];
        const targetVal = target[key];
        if (
            sourceVal &&
            typeof sourceVal === 'object' &&
            !Array.isArray(sourceVal) &&
            targetVal &&
            typeof targetVal === 'object' &&
            !Array.isArray(targetVal)
        ) {
            output[key] = deepMerge(targetVal, sourceVal);
        } else if (sourceVal !== undefined) {
            output[key] = sourceVal;
        }
    }
    return output;
}

function readLocalSettings() {
    try {
        const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (!raw) return null;
        return JSON.parse(raw);
    } catch {
        return null;
    }
}

const SiteSettingsContext = createContext();

export const SiteSettingsProvider = ({ children }) => {
    const [settings, setSettings] = useState(() => {
        const local = readLocalSettings();
        return local ? deepMerge(DEFAULT_SITE_SETTINGS, local) : DEFAULT_SITE_SETTINGS;
    });
    const [loading, setLoading] = useState(true);
    const [tableMissing, setTableMissing] = useState(false);

    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('site_settings')
                .select('data')
                .eq('id', 'default')
                .maybeSingle();

            if (error) {
                const msg = (error.message || '').toLowerCase();
                if (error.code === '42P01' || msg.includes('does not exist') || msg.includes('schema cache')) {
                    setTableMissing(true);
                }
                throw error;
            }

            setTableMissing(false);
            if (data?.data) {
                const merged = deepMerge(DEFAULT_SITE_SETTINGS, data.data);
                setSettings(merged);
                try {
                    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
                } catch {
                    // ignore quota errors
                }
            }
        } catch (err) {
            console.warn('SiteSettingsContext: using local/default settings.', err?.message || err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchSettings();

        const channel = supabase
            .channel('site-settings-realtime')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'site_settings' }, () => {
                fetchSettings();
            })
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [fetchSettings]);

    const saveSettings = useCallback(async (partialOrUpdater) => {
        const nextSettings = typeof partialOrUpdater === 'function'
            ? deepMerge(DEFAULT_SITE_SETTINGS, partialOrUpdater(settings))
            : deepMerge(settings, partialOrUpdater);

        try {
            const { error } = await supabase
                .from('site_settings')
                .upsert(
                    {
                        id: 'default',
                        data: nextSettings,
                        updated_at: new Date().toISOString(),
                    },
                    { onConflict: 'id' }
                );

            if (error) {
                const msg = (error.message || '').toLowerCase();
                const isMissing = error.code === '42P01' || error.code === 'PGRST205' || msg.includes('does not exist') || msg.includes('schema cache');
                if (isMissing) {
                    setTableMissing(true);
                    const missingErr = new Error("La table 'site_settings' n'existe pas dans Supabase. Veuillez exécuter le script SQL dans votre Dashboard Supabase pour persister les modifications.");
                    missingErr.code = 'TABLE_MISSING';
                    throw missingErr;
                }
                throw error;
            }

            // Persistence in Supabase succeeded: update local state & cache
            setSettings(nextSettings);
            setTableMissing(false);
            try {
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextSettings));
            } catch {
                // ignore quota errors
            }

            return { success: true, persistedTo: 'supabase' };
        } catch (err) {
            console.error('Error saving site_settings to Supabase:', err);
            return {
                success: false,
                persistedTo: null,
                error: err,
                message: err?.message || "Échec de l'enregistrement dans Supabase",
                tableMissing: err?.code === 'TABLE_MISSING' || tableMissing
            };
        }
    }, [settings, tableMissing]);

    /**
     * Helper to resolve a localized custom field with fallback to i18n t()
     */
    const getLocalizedValue = useCallback((obj, fieldBase, lang, fallback = '') => {
        if (!obj) return fallback;
        const isEn = (lang || 'fr').startsWith('en');
        const primary = isEn ? obj[`${fieldBase}_en`] : obj[`${fieldBase}_fr`];
        const secondary = isEn ? obj[`${fieldBase}_fr`] : obj[`${fieldBase}_en`];
        if (typeof primary === 'string' && primary.trim() !== '') return primary;
        if (typeof secondary === 'string' && secondary.trim() !== '') return secondary;
        return fallback;
    }, []);

    return (
        <SiteSettingsContext.Provider
            value={{
                settings,
                loading,
                tableMissing,
                fetchSettings,
                saveSettings,
                getLocalizedValue,
            }}
        >
            {children}
        </SiteSettingsContext.Provider>
    );
};

export const useSiteSettings = () => {
    const ctx = useContext(SiteSettingsContext);
    if (!ctx) {
        throw new Error('useSiteSettings must be used within a SiteSettingsProvider');
    }
    return ctx;
};
