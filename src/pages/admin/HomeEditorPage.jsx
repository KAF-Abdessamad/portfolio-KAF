import React, { useState, useEffect } from 'react';
import {
    Home,
    Save,
    Loader2,
    Sparkles,
    RotateCcw,
    Eye,
    CheckCircle2,
    AlertTriangle,
    UserCheck,
    Layers,
    FolderKanban,
    MessageSquare,
    Plus,
    X,
    Database,
    Trash2,
    Sliders,
    EyeOff
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';
import UploadZone from '../../components/admin/UploadZone';
import { useSiteSettings, DEFAULT_SITE_SETTINGS } from '../../hooks/useSiteSettings';
import { uploadFile, getPublicUrl } from '../../lib/storage';
import { translateText } from '../../utils/translate';
import frDefaults from '../../translations/fr.json';
import enDefaults from '../../translations/en.json';

const SECTIONS = [
    { id: 'visibility', label: 'Gestion des Sections', icon: Sliders },
    { id: 'hero', label: 'Hero & Profil', icon: UserCheck },
    { id: 'about', label: 'Section À propos', icon: Layers },
    { id: 'projects_contact', label: 'Projets & Contact', icon: FolderKanban },
];

export default function HomeEditorPage() {
    const { settings, loading, tableMissing, saveSettings } = useSiteSettings();
    const [activeSection, setActiveSection] = useState('visibility');
    const [homeForm, setHomeForm] = useState(settings.home || DEFAULT_SITE_SETTINGS.home);
    const [subtitleInput, setSubtitleInput] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [feedback, setFeedback] = useState(null);

    useEffect(() => {
        if (settings?.home) {
            setHomeForm(settings.home);
        }
    }, [settings]);

    const updateField = (sectionKey, field, value) => {
        setHomeForm(prev => ({
            ...prev,
            [sectionKey]: {
                ...prev[sectionKey],
                [field]: value,
            }
        }));
    };

    const updateSectionToggle = (sectionName, enabled) => {
        setHomeForm(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [sectionName]: enabled
            }
        }));
    };

    const handlePhotoUpload = async (file) => {
        setIsUploading(true);
        setFeedback(null);
        try {
            const fileName = `home-profile-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const { path, error } = await uploadFile('portfolio-images', file, fileName);
            if (error) throw error;
            const publicUrl = `${getPublicUrl('portfolio-images', path)}?v=${Date.now()}`;
            
            updateField('hero', 'profile_image_url', publicUrl);
            
            const nextHome = {
                ...homeForm,
                hero: {
                    ...homeForm.hero,
                    profile_image_url: publicUrl
                }
            };
            const saveRes = await saveSettings({ home: nextHome });
            if (saveRes.success && saveRes.persistedTo === 'supabase') {
                setFeedback({ type: 'success', message: 'Nouvelle photo téléversée et enregistrée dans Supabase avec succès !' });
            } else {
                setFeedback({
                    type: 'error',
                    message: `Photo téléversée dans le Storage, mais erreur d'enregistrement : ${saveRes.message || saveRes.error?.message || "Erreur Supabase"}`
                });
            }
        } catch (err) {
            console.error('Photo upload failed:', err);
            setFeedback({ type: 'error', message: err?.message || "Erreur lors de l'upload de l'image." });
        } finally {
            setIsUploading(false);
        }
    };

    const handleRemovePhoto = async () => {
        updateField('hero', 'profile_image_url', '');
        const nextHome = {
            ...homeForm,
            hero: {
                ...homeForm.hero,
                profile_image_url: ''
            }
        };
        await saveSettings({ home: nextHome });
        setFeedback({ type: 'success', message: 'Photo de profil supprimée et mise à jour dans Supabase !' });
    };

    const handleAddSubtitle = () => {
        const trimmed = subtitleInput.trim();
        if (!trimmed) return;
        const current = Array.isArray(homeForm.hero?.subtitles) ? homeForm.hero.subtitles : [];
        if (!current.includes(trimmed)) {
            updateField('hero', 'subtitles', [...current, trimmed]);
        }
        setSubtitleInput('');
    };

    const handleRemoveSubtitle = (idx) => {
        const current = Array.isArray(homeForm.hero?.subtitles) ? homeForm.hero.subtitles : [];
        updateField('hero', 'subtitles', current.filter((_, i) => i !== idx));
    };

    const handleAutoTranslateSection = async () => {
        setIsTranslating(true);
        setFeedback(null);
        try {
            if (activeSection === 'hero') {
                const h = homeForm.hero || {};
                const keys = ['available', 'greeting', 'subtitle_prefix', 'description', 'view_projects', 'download_cv', 'connect'];
                const translated = await Promise.all(
                    keys.map((k) => (h[`${k}_fr`] ? translateText(h[`${k}_fr`], 'fr', 'en') : Promise.resolve('')))
                );
                setHomeForm(prev => {
                    const nextHero = { ...prev.hero };
                    keys.forEach((k, idx) => {
                        if (translated[idx]) nextHero[`${k}_en`] = translated[idx];
                    });
                    return { ...prev, hero: nextHero };
                });
            } else if (activeSection === 'about') {
                const a = homeForm.about || {};
                const keys = [
                    'tech_title', 'tech_subtitle',
                    'academic_track', 'education_title', 'education_accent', 'education_desc',
                    'career_track', 'experience_title', 'experience_accent', 'experience_desc'
                ];
                const translated = await Promise.all(
                    keys.map((k) => (a[`${k}_fr`] ? translateText(a[`${k}_fr`], 'fr', 'en') : Promise.resolve('')))
                );
                setHomeForm(prev => {
                    const nextAbout = { ...prev.about };
                    keys.forEach((k, idx) => {
                        if (translated[idx]) nextAbout[`${k}_en`] = translated[idx];
                    });
                    return { ...prev, about: nextAbout };
                });
            } else {
                const p = homeForm.projects || {};
                const c = homeForm.contact || {};
                const pKeys = ['title', 'description'];
                const cKeys = ['badge', 'title', 'accent', 'description', 'info_title', 'info_subtitle'];
                const [pTrans, cTrans] = await Promise.all([
                    Promise.all(pKeys.map((k) => (p[`${k}_fr`] ? translateText(p[`${k}_fr`], 'fr', 'en') : Promise.resolve('')))),
                    Promise.all(cKeys.map((k) => (c[`${k}_fr`] ? translateText(c[`${k}_fr`], 'fr', 'en') : Promise.resolve('')))),
                ]);
                setHomeForm(prev => {
                    const nextProjects = { ...prev.projects };
                    const nextContact = { ...prev.contact };
                    pKeys.forEach((k, idx) => { if (pTrans[idx]) nextProjects[`${k}_en`] = pTrans[idx]; });
                    cKeys.forEach((k, idx) => { if (cTrans[idx]) nextContact[`${k}_en`] = cTrans[idx]; });
                    return { ...prev, projects: nextProjects, contact: nextContact };
                });
            }
            setFeedback({ type: 'success', message: 'Traduction automatique (FR ➔ EN) terminée avec succès.' });
        } catch (err) {
            console.error('Auto translate error:', err);
            setFeedback({ type: 'error', message: 'Erreur lors de la traduction automatique.' });
        } finally {
            setIsTranslating(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        setFeedback(null);
        try {
            const res = await saveSettings({ home: homeForm });
            if (res.success && res.persistedTo === 'supabase') {
                setFeedback({ type: 'success', message: "Page d'accueil enregistrée et publiée avec succès dans Supabase !" });
            } else {
                setFeedback({
                    type: 'error',
                    message: res.message || res.error?.message || "Erreur : impossible d'enregistrer dans Supabase."
                });
            }
        } catch (err) {
            setFeedback({ type: 'error', message: err?.message || "Erreur lors de l'enregistrement." });
        } finally {
            setIsSaving(false);
        }
    };

    const handleReset = async () => {
        if (!window.confirm("Réinitialiser tous les textes et médias de la page d'accueil aux valeurs par défaut ?")) return;
        setHomeForm(DEFAULT_SITE_SETTINGS.home);
        await saveSettings({ home: DEFAULT_SITE_SETTINGS.home });
        setFeedback({ type: 'success', message: "Page d'accueil réinitialisée aux valeurs par défaut." });
    };

    const inputClass = "w-full bg-bg-surface text-text-pri border border-border-def rounded-xl px-4 py-2.5 placeholder:text-text-mut outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors text-sm shadow-xs";

    const sectionsState = homeForm.sections || {};

    return (
        <div className="space-y-6 sm:space-y-8 pb-16">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center shrink-0">
                        <Home size={20} className="text-text-acc" />
                    </div>
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-text-pri">Éditeur Page d'accueil</h1>
                        <p className="text-text-sec text-xs sm:text-sm mt-0.5">
                            Modifiez, activez ou supprimez les éléments de la page d'accueil (FR / EN).
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                    <Link to="/" target="_blank" className="w-full sm:w-auto">
                        <Button variant="secondary" className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm">
                            <Eye size={16} />
                            <span>Voir le site</span>
                        </Button>
                    </Link>
                    <Button
                        variant="secondary"
                        onClick={handleReset}
                        disabled={isSaving}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                        <RotateCcw size={16} />
                        <span>Réinitialiser</span>
                    </Button>
                    <Button
                        variant="primary"
                        onClick={handleSave}
                        disabled={isSaving || loading}
                        className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs sm:text-sm"
                    >
                        {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                        <span>Enregistrer</span>
                    </Button>
                </div>
            </div>

            {/* Info hint */}
            <div className="p-4 rounded-2xl border border-border-def bg-bg-card/70 text-xs text-text-sec flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-theme-sm">
                <span>
                    Astuce : Vos modifications sont sauvegardées directement dans Supabase et effectives pour tous les visiteurs.
                </span>
                <button
                    type="button"
                    onClick={handleAutoTranslateSection}
                    disabled={isTranslating}
                    className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-text-acc rounded-lg hover:bg-accent/20 transition-all text-xs font-semibold border border-accent/20 shrink-0"
                >
                    <Sparkles size={14} />
                    <span>{isTranslating ? 'Traduction en cours...' : 'Traduire automatiquement (FR ➔ EN)'}</span>
                </button>
            </div>

            {feedback && (
                <div className={`p-4 rounded-2xl border flex items-center gap-3 text-sm ${
                    feedback.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : feedback.type === 'warning'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                    {feedback.type === 'success' ? <CheckCircle2 size={18} className="shrink-0" /> : <AlertTriangle size={18} className="shrink-0" />}
                    <span>{feedback.message}</span>
                </div>
            )}

            {tableMissing && (
                <div className="p-5 rounded-2xl border border-red-500/40 bg-red-500/10 text-red-300 flex items-start gap-4 text-sm">
                    <Database size={20} className="shrink-0 mt-0.5 text-red-400" />
                    <div className="space-y-2">
                        <p className="font-semibold text-red-200">Table Supabase manquante : site_settings</p>
                        <p className="text-xs text-red-300/90 leading-relaxed">
                            La table <code className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-white">public.site_settings</code> n'est pas encore créée dans votre base Supabase. Vos modifications (photo, textes) ne peuvent pas être enregistrées dans le cloud. Exécutez le script SQL disponible dans <code className="font-mono bg-black/40 px-1 py-0.5 rounded">supabase/migration_site_settings.sql</code> dans votre Dashboard Supabase (SQL Editor).
                        </p>
                    </div>
                </div>
            )}

            {/* Section Tabs */}
            <div className="flex flex-wrap gap-2 sm:gap-3">
                {SECTIONS.map((sec) => {
                    const active = activeSection === sec.id;
                    return (
                        <button
                            key={sec.id}
                            type="button"
                            onClick={() => setActiveSection(sec.id)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs sm:text-sm font-medium transition-all ${
                                active
                                    ? 'bg-accent text-text-inv border-accent shadow-accent'
                                    : 'bg-bg-card border-border-def text-text-sec hover:text-text-pri hover:border-accent/40'
                            }`}
                        >
                            <sec.icon size={16} />
                            <span>{sec.label}</span>
                        </button>
                    );
                })}
            </div>

            {/* 1. SECTIONS VISIBILITY / TOGGLES */}
            {activeSection === 'visibility' && (
                <div className="bg-bg-card border border-border-def rounded-3xl p-6 md:p-8 space-y-6 shadow-theme-sm">
                    <div>
                        <h2 className="text-xl font-bold text-text-pri">Affichage & Suppression de Sections</h2>
                        <p className="text-sm text-text-sec mt-1">
                            Activez ou désactivez les sections de votre page d'accueil d'un simple clic.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        {[
                            { id: 'hero', name: 'Section Hero (En-tête & Profil)', desc: 'Titre animé, description, boutons CTA et photo de profil' },
                            { id: 'about', name: 'Section À propos', desc: 'Carrousel de compétences, onglets Formations et Expériences' },
                            { id: 'projects', name: 'Section Projets', desc: 'Cartes de vos projets récents avec animations d’empilement' },
                            { id: 'contact', name: 'Section Contact', desc: 'Formulaire de message et coordonnées directes' },
                        ].map((sec) => {
                            const isVisible = sectionsState[sec.id] !== false;
                            return (
                                <div
                                    key={sec.id}
                                    className={`p-5 rounded-2xl border transition-all flex flex-col justify-between gap-4 ${
                                        isVisible
                                            ? 'bg-bg-surface border-border-def'
                                            : 'bg-bg-surface/40 border-dashed border-border-def/70 opacity-70'
                                    }`}
                                >
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <h3 className="font-semibold text-text-pri text-sm sm:text-base">{sec.name}</h3>
                                            <span className={`text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full border ${
                                                isVisible
                                                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                                                    : 'bg-red-500/10 text-red-400 border-red-500/30'
                                            }`}>
                                                {isVisible ? 'Visible' : 'Désactivée'}
                                            </span>
                                        </div>
                                        <p className="text-xs text-text-mut leading-relaxed">{sec.desc}</p>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t border-border-def/50">
                                        <span className="text-xs text-text-sec">Afficher sur le site :</span>
                                        <button
                                            type="button"
                                            onClick={() => updateSectionToggle(sec.id, !isVisible)}
                                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                isVisible ? 'bg-accent' : 'bg-gray-600'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                                    isVisible ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* 2. HERO EDITOR */}
            {activeSection === 'hero' && (
                <div className="space-y-6">
                    {/* Media & Options */}
                    <div className="bg-bg-card border border-border-def rounded-3xl p-6 md:p-8 space-y-6 shadow-theme-sm">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl font-bold text-text-pri">Photo de Profil & Options d'affichage</h2>
                            {homeForm.hero?.profile_image_url && (
                                <button
                                    type="button"
                                    onClick={handleRemovePhoto}
                                    className="flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 transition-colors"
                                >
                                    <Trash2 size={14} />
                                    <span>Supprimer la photo</span>
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-sm font-medium text-text-sec block">Photo de profil (Hero)</label>
                                <UploadZone
                                    preview={homeForm.hero?.profile_image_url || null}
                                    onFileSelected={handlePhotoUpload}
                                    onClear={handleRemovePhoto}
                                />
                                {isUploading && <p className="text-xs text-text-acc font-mono">Upload en cours dans Supabase...</p>}
                            </div>

                            <div className="space-y-4">
                                <label className="text-sm font-medium text-text-sec block">Technologies défilantes</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={subtitleInput}
                                        onChange={(e) => setSubtitleInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                handleAddSubtitle();
                                            }
                                        }}
                                        placeholder="ex: Next.js, Docker, AI..."
                                        className={`${inputClass} flex-1`}
                                    />
                                    <button
                                        type="button"
                                        onClick={handleAddSubtitle}
                                        className="px-4 py-2 bg-accent/10 text-text-acc border border-accent/20 rounded-xl hover:bg-accent/20 transition-colors"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {(homeForm.hero?.subtitles || []).map((item, idx) => (
                                        <span
                                            key={idx}
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-bg-surface border border-border-def text-xs font-mono text-text-pri"
                                        >
                                            {item}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveSubtitle(idx)}
                                                className="text-text-mut hover:text-red-400"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>

                                <div className="pt-4 border-t border-border-def/60 space-y-3">
                                    <label className="text-xs font-mono uppercase text-text-mut block">Visibilité des sous-éléments Hero</label>
                                    <div className="flex flex-col gap-2.5">
                                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-bg-surface border border-border-def text-xs cursor-pointer">
                                            <span>Afficher la photo d'arrière-plan</span>
                                            <input
                                                type="checkbox"
                                                checked={homeForm.hero?.show_photo !== false}
                                                onChange={(e) => updateField('hero', 'show_photo', e.target.checked)}
                                                className="w-4 h-4 accent-accent rounded"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-bg-surface border border-border-def text-xs cursor-pointer">
                                            <span>Afficher le badge de disponibilité</span>
                                            <input
                                                type="checkbox"
                                                checked={homeForm.hero?.show_badge !== false}
                                                onChange={(e) => updateField('hero', 'show_badge', e.target.checked)}
                                                className="w-4 h-4 accent-accent rounded"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-bg-surface border border-border-def text-xs cursor-pointer">
                                            <span>Afficher les boutons d'action (Projets / CV)</span>
                                            <input
                                                type="checkbox"
                                                checked={homeForm.hero?.show_actions !== false}
                                                onChange={(e) => updateField('hero', 'show_actions', e.target.checked)}
                                                className="w-4 h-4 accent-accent rounded"
                                            />
                                        </label>
                                        <label className="flex items-center justify-between p-2.5 rounded-xl bg-bg-surface border border-border-def text-xs cursor-pointer">
                                            <span>Afficher les liens réseaux sociaux</span>
                                            <input
                                                type="checkbox"
                                                checked={homeForm.hero?.show_social !== false}
                                                onChange={(e) => updateField('hero', 'show_social', e.target.checked)}
                                                className="w-4 h-4 accent-accent rounded"
                                            />
                                        </label>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Texts */}
                    <div className="bg-bg-card border border-border-def rounded-3xl p-6 md:p-8 space-y-6 shadow-theme-sm">
                        <h2 className="text-xl font-bold text-text-pri">Textes & Titres Hero</h2>

                        <BilingualField
                            label="Badge de disponibilité"
                            frVal={homeForm.hero?.available_fr || ''}
                            enVal={homeForm.hero?.available_en || ''}
                            frPlaceholder={frDefaults.hero.available}
                            enPlaceholder={enDefaults.hero.available}
                            onFrChange={(v) => updateField('hero', 'available_fr', v)}
                            onEnChange={(v) => updateField('hero', 'available_en', v)}
                            inputClass={inputClass}
                        />

                        <BilingualField
                            label="Titre principal (Machine à écrire)"
                            frVal={homeForm.hero?.greeting_fr || ''}
                            enVal={homeForm.hero?.greeting_en || ''}
                            frPlaceholder={frDefaults.hero.greeting}
                            enPlaceholder={enDefaults.hero.greeting}
                            onFrChange={(v) => updateField('hero', 'greeting_fr', v)}
                            onEnChange={(v) => updateField('hero', 'greeting_en', v)}
                            inputClass={inputClass}
                        />

                        <BilingualField
                            label="Préfixe du sous-titre"
                            frVal={homeForm.hero?.subtitle_prefix_fr || ''}
                            enVal={homeForm.hero?.subtitle_prefix_en || ''}
                            frPlaceholder={frDefaults.hero.subtitle_prefix}
                            enPlaceholder={enDefaults.hero.subtitle_prefix}
                            onFrChange={(v) => updateField('hero', 'subtitle_prefix_fr', v)}
                            onEnChange={(v) => updateField('hero', 'subtitle_prefix_en', v)}
                            inputClass={inputClass}
                        />

                        <BilingualField
                            label="Description (supporte <strong>texte</strong>)"
                            multiline
                            frVal={homeForm.hero?.description_fr || ''}
                            enVal={homeForm.hero?.description_en || ''}
                            frPlaceholder={frDefaults.hero.description}
                            enPlaceholder={enDefaults.hero.description}
                            onFrChange={(v) => updateField('hero', 'description_fr', v)}
                            onEnChange={(v) => updateField('hero', 'description_en', v)}
                            inputClass={inputClass}
                        />

                        <BilingualField
                            label="Texte Bouton Projets"
                            frVal={homeForm.hero?.view_projects_fr || ''}
                            enVal={homeForm.hero?.view_projects_en || ''}
                            frPlaceholder={frDefaults.hero.view_projects}
                            enPlaceholder={enDefaults.hero.view_projects}
                            onFrChange={(v) => updateField('hero', 'view_projects_fr', v)}
                            onEnChange={(v) => updateField('hero', 'view_projects_en', v)}
                            inputClass={inputClass}
                        />

                        <BilingualField
                            label="Texte Bouton CV"
                            frVal={homeForm.hero?.download_cv_fr || ''}
                            enVal={homeForm.hero?.download_cv_en || ''}
                            frPlaceholder={frDefaults.hero.download_cv}
                            enPlaceholder={enDefaults.hero.download_cv}
                            onFrChange={(v) => updateField('hero', 'download_cv_fr', v)}
                            onEnChange={(v) => updateField('hero', 'download_cv_en', v)}
                            inputClass={inputClass}
                        />

                        <BilingualField
                            label="Texte Réseaux Sociaux"
                            frVal={homeForm.hero?.connect_fr || ''}
                            enVal={homeForm.hero?.connect_en || ''}
                            frPlaceholder={frDefaults.hero.connect}
                            enPlaceholder={enDefaults.hero.connect}
                            onFrChange={(v) => updateField('hero', 'connect_fr', v)}
                            onEnChange={(v) => updateField('hero', 'connect_en', v)}
                            inputClass={inputClass}
                        />
                    </div>
                </div>
            )}

            {/* 3. ABOUT EDITOR */}
            {activeSection === 'about' && (
                <div className="bg-bg-card border border-border-def rounded-3xl p-6 md:p-8 space-y-6 shadow-theme-sm">
                    <h2 className="text-xl font-bold text-text-pri">Textes de la section À propos</h2>

                    <BilingualField
                        label="Titre Technologies"
                        frVal={homeForm.about?.tech_title_fr || ''}
                        enVal={homeForm.about?.tech_title_en || ''}
                        frPlaceholder={frDefaults.about.tech_title}
                        enPlaceholder={enDefaults.about.tech_title}
                        onFrChange={(v) => updateField('about', 'tech_title_fr', v)}
                        onEnChange={(v) => updateField('about', 'tech_title_en', v)}
                        inputClass={inputClass}
                    />
                    <BilingualField
                        label="Sous-titre Technologies"
                        frVal={homeForm.about?.tech_subtitle_fr || ''}
                        enVal={homeForm.about?.tech_subtitle_en || ''}
                        frPlaceholder={frDefaults.about.tech_subtitle}
                        enPlaceholder={enDefaults.about.tech_subtitle}
                        onFrChange={(v) => updateField('about', 'tech_subtitle_fr', v)}
                        onEnChange={(v) => updateField('about', 'tech_subtitle_en', v)}
                        inputClass={inputClass}
                    />

                    <div className="pt-4 border-t border-border-def space-y-6">
                        <h3 className="text-lg font-semibold text-text-acc">Onglet Formation</h3>
                        <BilingualField
                            label="Badge Formation"
                            frVal={homeForm.about?.academic_track_fr || ''}
                            enVal={homeForm.about?.academic_track_en || ''}
                            frPlaceholder={frDefaults.about.academic_track}
                            enPlaceholder={enDefaults.about.academic_track}
                            onFrChange={(v) => updateField('about', 'academic_track_fr', v)}
                            onEnChange={(v) => updateField('about', 'academic_track_en', v)}
                            inputClass={inputClass}
                        />
                        <BilingualField
                            label="Titre Formation (début)"
                            frVal={homeForm.about?.education_title_fr || ''}
                            enVal={homeForm.about?.education_title_en || ''}
                            frPlaceholder={frDefaults.about.education_title}
                            enPlaceholder={enDefaults.about.education_title}
                            onFrChange={(v) => updateField('about', 'education_title_fr', v)}
                            onEnChange={(v) => updateField('about', 'education_title_en', v)}
                            inputClass={inputClass}
                        />
                        <BilingualField
                            label="Mot accentué Formation"
                            frVal={homeForm.about?.education_accent_fr || ''}
                            enVal={homeForm.about?.education_accent_en || ''}
                            frPlaceholder={frDefaults.about.education_accent}
                            enPlaceholder={enDefaults.about.education_accent}
                            onFrChange={(v) => updateField('about', 'education_accent_fr', v)}
                            onEnChange={(v) => updateField('about', 'education_accent_en', v)}
                            inputClass={inputClass}
                        />
                        <BilingualField
                            label="Description Formation"
                            multiline
                            frVal={homeForm.about?.education_desc_fr || ''}
                            enVal={homeForm.about?.education_desc_en || ''}
                            frPlaceholder={frDefaults.about.education_desc}
                            enPlaceholder={enDefaults.about.education_desc}
                            onFrChange={(v) => updateField('about', 'education_desc_fr', v)}
                            onEnChange={(v) => updateField('about', 'education_desc_en', v)}
                            inputClass={inputClass}
                        />
                    </div>

                    <div className="pt-4 border-t border-border-def space-y-6">
                        <h3 className="text-lg font-semibold text-text-acc">Onglet Expérience</h3>
                        <BilingualField
                            label="Badge Expérience"
                            frVal={homeForm.about?.career_track_fr || ''}
                            enVal={homeForm.about?.career_track_en || ''}
                            frPlaceholder={frDefaults.about.career_track}
                            enPlaceholder={enDefaults.about.career_track}
                            onFrChange={(v) => updateField('about', 'career_track_fr', v)}
                            onEnChange={(v) => updateField('about', 'career_track_en', v)}
                            inputClass={inputClass}
                        />
                        <BilingualField
                            label="Titre Expérience (début)"
                            frVal={homeForm.about?.experience_title_fr || ''}
                            enVal={homeForm.about?.experience_title_en || ''}
                            frPlaceholder={frDefaults.about.experience_title}
                            enPlaceholder={enDefaults.about.experience_title}
                            onFrChange={(v) => updateField('about', 'experience_title_fr', v)}
                            onEnChange={(v) => updateField('about', 'experience_title_en', v)}
                            inputClass={inputClass}
                        />
                        <BilingualField
                            label="Mot accentué Expérience"
                            frVal={homeForm.about?.experience_accent_fr || ''}
                            enVal={homeForm.about?.experience_accent_en || ''}
                            frPlaceholder={frDefaults.about.experience_accent}
                            enPlaceholder={enDefaults.about.experience_accent}
                            onFrChange={(v) => updateField('about', 'experience_accent_fr', v)}
                            onEnChange={(v) => updateField('about', 'experience_accent_en', v)}
                            inputClass={inputClass}
                        />
                        <BilingualField
                            label="Description Expérience"
                            multiline
                            frVal={homeForm.about?.experience_desc_fr || ''}
                            enVal={homeForm.about?.experience_desc_en || ''}
                            frPlaceholder={frDefaults.about.experience_desc}
                            enPlaceholder={enDefaults.about.experience_desc}
                            onFrChange={(v) => updateField('about', 'experience_desc_fr', v)}
                            onEnChange={(v) => updateField('about', 'experience_desc_en', v)}
                            inputClass={inputClass}
                        />
                    </div>
                </div>
            )}

            {/* 4. PROJECTS & CONTACT EDITOR */}
            {activeSection === 'projects_contact' && (
                <div className="space-y-6">
                    <div className="bg-bg-card border border-border-def rounded-3xl p-6 md:p-8 space-y-6 shadow-theme-sm">
                        <h2 className="text-xl font-bold text-text-pri">En-tête Section Projets</h2>
                        <BilingualField
                            label="Titre Projets"
                            frVal={homeForm.projects?.title_fr || ''}
                            enVal={homeForm.projects?.title_en || ''}
                            frPlaceholder={frDefaults.projects.title}
                            enPlaceholder={enDefaults.projects.title}
                            onFrChange={(v) => updateField('projects', 'title_fr', v)}
                            onEnChange={(v) => updateField('projects', 'title_en', v)}
                            inputClass={inputClass}
                        />
                        <BilingualField
                            label="Description Projets"
                            multiline
                            frVal={homeForm.projects?.description_fr || ''}
                            enVal={homeForm.projects?.description_en || ''}
                            frPlaceholder={frDefaults.projects.description}
                            enPlaceholder={enDefaults.projects.description}
                            onFrChange={(v) => updateField('projects', 'description_fr', v)}
                            onEnChange={(v) => updateField('projects', 'description_en', v)}
                            inputClass={inputClass}
                        />
                    </div>

                    <div className="bg-bg-card border border-border-def rounded-3xl p-6 md:p-8 space-y-6 shadow-theme-sm">
                        <div className="flex items-center gap-2">
                            <MessageSquare size={20} className="text-text-acc" />
                            <h2 className="text-xl font-bold text-text-pri">En-tête Section Contact</h2>
                        </div>
                        <BilingualField
                            label="Badge Contact"
                            frVal={homeForm.contact?.badge_fr || ''}
                            enVal={homeForm.contact?.badge_en || ''}
                            frPlaceholder={frDefaults.contact.badge}
                            enPlaceholder={enDefaults.contact.badge}
                            onFrChange={(v) => updateField('contact', 'badge_fr', v)}
                            onEnChange={(v) => updateField('contact', 'badge_en', v)}
                            inputClass={inputClass}
                        />
                        <BilingualField
                            label="Titre Contact (début)"
                            frVal={homeForm.contact?.title_fr || ''}
                            enVal={homeForm.contact?.title_en || ''}
                            frPlaceholder={frDefaults.contact.title}
                            enPlaceholder={enDefaults.contact.title}
                            onFrChange={(v) => updateField('contact', 'title_fr', v)}
                            onEnChange={(v) => updateField('contact', 'title_en', v)}
                            inputClass={inputClass}
                        />
                        <BilingualField
                            label="Mot accentué Contact"
                            frVal={homeForm.contact?.accent_fr || ''}
                            enVal={homeForm.contact?.accent_en || ''}
                            frPlaceholder={frDefaults.contact.accent}
                            enPlaceholder={enDefaults.contact.accent}
                            onFrChange={(v) => updateField('contact', 'accent_fr', v)}
                            onEnChange={(v) => updateField('contact', 'accent_en', v)}
                            inputClass={inputClass}
                        />
                        <BilingualField
                            label="Description Contact"
                            multiline
                            frVal={homeForm.contact?.description_fr || ''}
                            enVal={homeForm.contact?.description_en || ''}
                            frPlaceholder={frDefaults.contact.description}
                            enPlaceholder={enDefaults.contact.description}
                            onFrChange={(v) => updateField('contact', 'description_fr', v)}
                            onEnChange={(v) => updateField('contact', 'description_en', v)}
                            inputClass={inputClass}
                        />
                        <BilingualField
                            label="Titre panneau Coordonnées"
                            frVal={homeForm.contact?.info_title_fr || ''}
                            enVal={homeForm.contact?.info_title_en || ''}
                            frPlaceholder={frDefaults.contact.info_title}
                            enPlaceholder={enDefaults.contact.info_title}
                            onFrChange={(v) => updateField('contact', 'info_title_fr', v)}
                            onEnChange={(v) => updateField('contact', 'info_title_en', v)}
                            inputClass={inputClass}
                        />
                        <BilingualField
                            label="Sous-titre panneau Coordonnées"
                            multiline
                            frVal={homeForm.contact?.info_subtitle_fr || ''}
                            enVal={homeForm.contact?.info_subtitle_en || ''}
                            frPlaceholder={frDefaults.contact.info_subtitle}
                            enPlaceholder={enDefaults.contact.info_subtitle}
                            onFrChange={(v) => updateField('contact', 'info_subtitle_fr', v)}
                            onEnChange={(v) => updateField('contact', 'info_subtitle_en', v)}
                            inputClass={inputClass}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

function BilingualField({
    label,
    frVal,
    enVal,
    frPlaceholder,
    enPlaceholder,
    onFrChange,
    onEnChange,
    inputClass,
    multiline = false
}) {
    return (
        <div className="space-y-2 p-4 rounded-2xl bg-bg-surface/50 border border-border-def/60">
            <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-text-pri block">{label}</label>
                {(frVal || enVal) && (
                    <button
                        type="button"
                        onClick={() => {
                            onFrChange('');
                            onEnChange('');
                        }}
                        className="text-[11px] text-red-400 hover:text-red-300 flex items-center gap-1 transition-colors px-2 py-0.5 rounded-md hover:bg-red-500/10"
                        title="Vider et réinitialiser ce champ"
                    >
                        <Trash2 size={12} />
                        <span>Effacer</span>
                    </button>
                )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono uppercase text-text-mut block">Français (FR)</span>
                        {frVal && (
                            <button
                                type="button"
                                onClick={() => onFrChange('')}
                                className="text-[10px] text-gray-400 hover:text-red-400 transition-colors"
                            >
                                Vider (FR)
                            </button>
                        )}
                    </div>
                    {multiline ? (
                        <textarea
                            rows={3}
                            value={frVal}
                            onChange={(e) => onFrChange(e.target.value)}
                            placeholder={frPlaceholder}
                            className={`${inputClass} resize-none`}
                        />
                    ) : (
                        <input
                            type="text"
                            value={frVal}
                            onChange={(e) => onFrChange(e.target.value)}
                            placeholder={frPlaceholder}
                            className={inputClass}
                        />
                    )}
                </div>
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <span className="text-[11px] font-mono uppercase text-text-mut block">English (EN)</span>
                        {enVal && (
                            <button
                                type="button"
                                onClick={() => onEnChange('')}
                                className="text-[10px] text-gray-400 hover:text-red-400 transition-colors"
                            >
                                Vider (EN)
                            </button>
                        )}
                    </div>
                    {multiline ? (
                        <textarea
                            rows={3}
                            value={enVal}
                            onChange={(e) => onEnChange(e.target.value)}
                            placeholder={enPlaceholder}
                            className={`${inputClass} resize-none`}
                        />
                    ) : (
                        <input
                            type="text"
                            value={enVal}
                            onChange={(e) => onEnChange(e.target.value)}
                            placeholder={enPlaceholder}
                            className={inputClass}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
