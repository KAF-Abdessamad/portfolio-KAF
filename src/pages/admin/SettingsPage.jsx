import React, { useState, useEffect } from 'react';
import {
    Bell,
    Shield,
    User,
    Palette,
    Globe,
    Save,
    Loader2,
    Lock,
    CheckCircle2,
    AlertTriangle,
    Sparkles,
    Sun,
    Moon,
    LogOut,
    RotateCcw,
    Database,
    Mail
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Button from '../../components/ui/Button';
import { useSiteSettings, DEFAULT_SITE_SETTINGS } from '../../hooks/useSiteSettings';
import { useTheme } from '../../hooks/useTheme';
import { useAdmin } from '../../context/AdminContext';
import { supabase } from '../../lib/supabase';
import { translateText } from '../../utils/translate';
import { CONTACT_CONFIG } from '../../lib/constants/contact';

const TABS = [
    { id: 'profile', label: 'Profil', icon: User },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'seo', label: 'SEO & Langues', icon: Globe },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
];

const SITE_SETTINGS_SQL = `CREATE TABLE IF NOT EXISTS site_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read access on site_settings" ON site_settings FOR SELECT TO public USING (true);
CREATE POLICY "Admin full access on site_settings" ON site_settings FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());`;

export default function SettingsPage() {
    const { i18n } = useTranslation();
    const { settings, loading, tableMissing, saveSettings } = useSiteSettings();
    const { theme, toggleTheme } = useTheme();
    const { user, logout } = useAdmin();

    const [activeTab, setActiveTab] = useState('profile');
    const [form, setForm] = useState(settings);
    const [isSaving, setIsSaving] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [saveFeedback, setSaveFeedback] = useState(null);

    // Security / Password state
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordLoading, setPasswordLoading] = useState(false);
    const [passwordFeedback, setPasswordFeedback] = useState(null);

    useEffect(() => {
        setForm(settings);
    }, [settings]);

    const updateSection = (section, field, value) => {
        setForm(prev => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            }
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        setSaveFeedback(null);
        try {
            const res = await saveSettings({
                profile: form.profile,
                appearance: form.appearance,
                seo: form.seo,
                notifications: form.notifications,
            });
            if (res.success && res.persistedTo === 'supabase') {
                setSaveFeedback({
                    type: 'success',
                    message: 'Paramètres enregistrés dans Supabase et appliqués sur le portfolio.'
                });
            } else {
                setSaveFeedback({
                    type: 'error',
                    message: res.message || res.error?.message || 'Erreur lors de l\'enregistrement dans Supabase.'
                });
            }
        } catch (err) {
            setSaveFeedback({
                type: 'error',
                message: err?.message || 'Erreur lors de l\'enregistrement des paramètres dans Supabase.'
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleResetDefaults = async () => {
        if (!window.confirm('Réinitialiser les paramètres généraux par défaut ?')) return;
        const resetPayload = {
            profile: DEFAULT_SITE_SETTINGS.profile,
            appearance: DEFAULT_SITE_SETTINGS.appearance,
            seo: DEFAULT_SITE_SETTINGS.seo,
            notifications: DEFAULT_SITE_SETTINGS.notifications,
        };
        setForm(prev => ({ ...prev, ...resetPayload }));
        await saveSettings(resetPayload);
        setSaveFeedback({ type: 'success', message: 'Paramètres réinitialisés par défaut.' });
    };

    const handleTranslateProfile = async () => {
        setIsTranslating(true);
        try {
            const [locEn, bioEn] = await Promise.all([
                form.profile.location_fr ? translateText(form.profile.location_fr, 'fr', 'en') : Promise.resolve(''),
                form.profile.footerBio_fr ? translateText(form.profile.footerBio_fr, 'fr', 'en') : Promise.resolve(''),
            ]);
            setForm(prev => ({
                ...prev,
                profile: {
                    ...prev.profile,
                    location_en: locEn || prev.profile.location_en,
                    footerBio_en: bioEn || prev.profile.footerBio_en,
                }
            }));
        } finally {
            setIsTranslating(false);
        }
    };

    const handleTranslateSEO = async () => {
        setIsTranslating(true);
        try {
            const [titleEn, roleEn, descEn, kwEn] = await Promise.all([
                form.seo.title_fr ? translateText(form.seo.title_fr, 'fr', 'en') : Promise.resolve(''),
                form.seo.role_fr ? translateText(form.seo.role_fr, 'fr', 'en') : Promise.resolve(''),
                form.seo.description_fr ? translateText(form.seo.description_fr, 'fr', 'en') : Promise.resolve(''),
                form.seo.keywords_fr ? translateText(form.seo.keywords_fr, 'fr', 'en') : Promise.resolve(''),
            ]);
            setForm(prev => ({
                ...prev,
                seo: {
                    ...prev.seo,
                    title_en: titleEn || prev.seo.title_en,
                    role_en: roleEn || prev.seo.role_en,
                    description_en: descEn || prev.seo.description_en,
                    keywords_en: kwEn || prev.seo.keywords_en,
                }
            }));
        } finally {
            setIsTranslating(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setPasswordFeedback(null);

        if (newPassword.length < 6) {
            setPasswordFeedback({ type: 'error', message: 'Le mot de passe doit contenir au moins 6 caractères.' });
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordFeedback({ type: 'error', message: 'Les mots de passe ne correspondent pas.' });
            return;
        }

        setPasswordLoading(true);
        try {
            const { error } = await supabase.auth.updateUser({ password: newPassword });
            if (error) throw error;
            setPasswordFeedback({ type: 'success', message: 'Mot de passe mis à jour avec succès.' });
            setNewPassword('');
            setConfirmPassword('');
            setShowPasswordForm(false);
        } catch (err) {
            setPasswordFeedback({ type: 'error', message: err?.message || 'Erreur lors de la mise à jour du mot de passe.' });
        } finally {
            setPasswordLoading(false);
        }
    };

    const handleGlobalSignOut = async () => {
        if (!window.confirm('Déconnecter toutes les sessions actives ?')) return;
        try {
            await supabase.auth.signOut({ scope: 'global' });
            await logout();
        } catch (err) {
            console.error('Global sign out error:', err);
        }
    };

    const inputClass = "w-full bg-bg-surface/60 border border-border-def rounded-xl px-4 py-3 text-text-pri outline-none focus:border-accent transition-colors";
    const emailjsConfigured = Boolean(
        CONTACT_CONFIG.SERVICE_ID && CONTACT_CONFIG.TEMPLATE_ID && CONTACT_CONFIG.PUBLIC_KEY
    );

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-pri">Paramètres</h1>
                    <p className="text-text-sec mt-1">Configurez les préférences globales de votre portfolio.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="secondary"
                        className="flex items-center gap-2"
                        onClick={handleResetDefaults}
                        disabled={isSaving}
                    >
                        <RotateCcw size={16} />
                        <span>Réinitialiser</span>
                    </Button>
                    <Button
                        variant="primary"
                        className="flex items-center gap-2"
                        onClick={handleSave}
                        disabled={isSaving || loading}
                    >
                        {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                        <span>Enregistrer les modifications</span>
                    </Button>
                </div>
            </div>

            {/* Save Feedback */}
            {saveFeedback && (
                <div className={`p-4 rounded-2xl border flex items-center gap-3 text-sm ${
                    saveFeedback.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : saveFeedback.type === 'warning'
                            ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                    {saveFeedback.type === 'success' ? <CheckCircle2 size={18} /> : <AlertTriangle size={18} />}
                    <span>{saveFeedback.message}</span>
                </div>
            )}

            {/* Table missing banner */}
            {tableMissing && (
                <div className="p-4 rounded-2xl border border-amber-500/30 bg-amber-500/5 text-amber-300 space-y-2 text-xs">
                    <div className="flex items-center gap-2 font-semibold text-sm">
                        <Database size={16} />
                        <span>Table Supabase <code className="font-mono bg-amber-500/10 px-1.5 py-0.5 rounded">site_settings</code> non détectée</span>
                    </div>
                    <p>Les modifications sont sauvegardées dans ce navigateur. Pour les synchroniser avec Supabase, exécutez ce SQL dans votre éditeur Supabase :</p>
                    <pre className="p-3 rounded-xl bg-black/40 overflow-x-auto font-mono text-[11px] text-amber-200">{SITE_SETTINGS_SQL}</pre>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Navigation Tabs */}
                <div className="space-y-2">
                    {TABS.map((tab) => (
                        <SettingsTab
                            key={tab.id}
                            icon={tab.icon}
                            label={tab.label}
                            active={activeTab === tab.id}
                            onClick={() => setActiveTab(tab.id)}
                        />
                    ))}
                </div>

                {/* Right Column: Active Content */}
                <div className="lg:col-span-2 space-y-8">
                    {activeTab === 'profile' && (
                        <section className="bg-bg-card backdrop-blur-xl border border-border-def p-8 rounded-3xl space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <User className="text-text-acc" />
                                    <h2 className="text-xl font-bold text-text-pri">Profil & Coordonnées publiques</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleTranslateProfile}
                                    disabled={isTranslating}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-text-acc rounded-lg hover:bg-accent/20 transition-all text-xs font-bold border border-accent/20"
                                >
                                    <Sparkles size={14} />
                                    <span>{isTranslating ? 'Traduction...' : 'Auto-Translate (FR ➔ EN)'}</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">Nom complet</label>
                                    <input
                                        type="text"
                                        value={form.profile?.fullName || ''}
                                        onChange={(e) => updateSection('profile', 'fullName', e.target.value)}
                                        className={inputClass}
                                        placeholder="Abdessamad KAF"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">Email public</label>
                                    <input
                                        type="email"
                                        value={form.profile?.email || ''}
                                        onChange={(e) => updateSection('profile', 'email', e.target.value)}
                                        placeholder="votre@email.com"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">Téléphone</label>
                                    <input
                                        type="text"
                                        value={form.profile?.phone || ''}
                                        onChange={(e) => updateSection('profile', 'phone', e.target.value)}
                                        placeholder="+212 6 ..."
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">Localisation (FR)</label>
                                    <input
                                        type="text"
                                        value={form.profile?.location_fr || ''}
                                        onChange={(e) => updateSection('profile', 'location_fr', e.target.value)}
                                        placeholder="Fès, Maroc"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">Location (EN)</label>
                                    <input
                                        type="text"
                                        value={form.profile?.location_en || ''}
                                        onChange={(e) => updateSection('profile', 'location_en', e.target.value)}
                                        placeholder="Fez, Morocco"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">URL GitHub</label>
                                    <input
                                        type="url"
                                        value={form.profile?.githubUrl || ''}
                                        onChange={(e) => updateSection('profile', 'githubUrl', e.target.value)}
                                        placeholder="https://github.com/..."
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <label className="text-sm text-text-sec">URL LinkedIn</label>
                                    <input
                                        type="url"
                                        value={form.profile?.linkedinUrl || ''}
                                        onChange={(e) => updateSection('profile', 'linkedinUrl', e.target.value)}
                                        placeholder="https://www.linkedin.com/in/..."
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">Bio courte Footer (FR)</label>
                                    <textarea
                                        rows={3}
                                        value={form.profile?.footerBio_fr || ''}
                                        onChange={(e) => updateSection('profile', 'footerBio_fr', e.target.value)}
                                        className={`${inputClass} resize-none`}
                                        placeholder="Laissez vide pour utiliser la traduction par défaut..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">Short Footer Bio (EN)</label>
                                    <textarea
                                        rows={3}
                                        value={form.profile?.footerBio_en || ''}
                                        onChange={(e) => updateSection('profile', 'footerBio_en', e.target.value)}
                                        className={`${inputClass} resize-none`}
                                        placeholder="Leave empty to use default translation..."
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'appearance' && (
                        <section className="bg-bg-card backdrop-blur-xl border border-border-def p-8 rounded-3xl space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Palette className="text-text-acc" />
                                <h2 className="text-xl font-bold text-text-pri">Apparence & Affichage</h2>
                            </div>

                            {/* Current Theme Preview Toggle */}
                            <div className="bg-bg-surface/40 p-5 rounded-2xl border border-border-def flex items-center justify-between gap-4">
                                <div>
                                    <p className="font-semibold text-text-pri">Thème actif dans cet aperçu</p>
                                    <p className="text-xs text-text-mut mt-0.5">
                                        Actuellement en mode {theme === 'dark' ? 'Sombre' : 'Clair'}
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={toggleTheme}
                                    className="px-4 py-2 rounded-xl bg-bg-card border border-border-def text-text-pri hover:border-accent flex items-center gap-2 text-sm font-medium transition-colors"
                                >
                                    {theme === 'dark' ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-indigo-500" />}
                                    <span>Basculer en {theme === 'dark' ? 'Clair' : 'Sombre'}</span>
                                </button>
                            </div>

                            {/* Default Theme */}
                            <div className="space-y-2">
                                <label className="text-sm text-text-sec">Thème par défaut pour les nouveaux visiteurs</label>
                                <div className="grid grid-cols-2 gap-4">
                                    {[
                                        { value: 'dark', label: 'Mode Sombre', icon: Moon },
                                        { value: 'light', label: 'Mode Clair', icon: Sun },
                                    ].map((opt) => (
                                        <button
                                            key={opt.value}
                                            type="button"
                                            onClick={() => updateSection('appearance', 'defaultTheme', opt.value)}
                                            className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                                                form.appearance?.defaultTheme === opt.value
                                                    ? 'bg-accent/10 border-accent text-text-pri'
                                                    : 'bg-bg-surface/30 border-border-def text-text-mut hover:text-text-pri'
                                            }`}
                                        >
                                            <opt.icon size={18} />
                                            <span className="font-medium">{opt.label}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Feature Toggles */}
                            <div className="space-y-4 pt-2">
                                <ToggleRow
                                    label="Badge « Disponible pour projets »"
                                    description="Affiche le badge animé au-dessus du titre dans la section Hero."
                                    checked={form.appearance?.showAvailabilityBadge !== false}
                                    onChange={(v) => updateSection('appearance', 'showAvailabilityBadge', v)}
                                />
                                <ToggleRow
                                    label="Effets lumineux (Glow)"
                                    description="Affiche les halos lumineux d'arrière-plan dans le Hero."
                                    checked={form.appearance?.enableGlowEffects !== false}
                                    onChange={(v) => updateSection('appearance', 'enableGlowEffects', v)}
                                />
                                <ToggleRow
                                    label="Liens des réseaux sociaux"
                                    description="Affiche les boutons GitHub et LinkedIn dans le Header, Hero, Contact et Footer."
                                    checked={form.appearance?.showSocialLinks !== false}
                                    onChange={(v) => updateSection('appearance', 'showSocialLinks', v)}
                                />
                            </div>
                        </section>
                    )}

                    {activeTab === 'seo' && (
                        <section className="bg-bg-card backdrop-blur-xl border border-border-def p-8 rounded-3xl space-y-6">
                            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <Globe className="text-text-acc" />
                                    <h2 className="text-xl font-bold text-text-pri">SEO & Langues</h2>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleTranslateSEO}
                                    disabled={isTranslating}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-text-acc rounded-lg hover:bg-accent/20 transition-all text-xs font-bold border border-accent/20"
                                >
                                    <Sparkles size={14} />
                                    <span>{isTranslating ? 'Traduction...' : 'Auto-Translate (FR ➔ EN)'}</span>
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">Langue active / par défaut</label>
                                    <div className="flex gap-3">
                                        {[
                                            { code: 'fr', label: 'Français (FR)' },
                                            { code: 'en', label: 'English (EN)' },
                                        ].map((lng) => (
                                            <button
                                                key={lng.code}
                                                type="button"
                                                onClick={() => {
                                                    updateSection('seo', 'defaultLanguage', lng.code);
                                                    i18n.changeLanguage(lng.code);
                                                }}
                                                className={`flex-1 py-2.5 px-4 rounded-xl border text-sm font-medium transition-all ${
                                                    (form.seo?.defaultLanguage || 'fr') === lng.code
                                                        ? 'bg-accent/15 border-accent text-text-pri'
                                                        : 'bg-bg-surface/40 border-border-def text-text-mut hover:text-text-pri'
                                                }`}
                                            >
                                                {lng.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">URL du site (Canonical)</label>
                                    <input
                                        type="url"
                                        value={form.seo?.siteUrl || ''}
                                        onChange={(e) => updateSection('seo', 'siteUrl', e.target.value)}
                                        placeholder="https://portfolio-kaf.vercel.app"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">Titre SEO (FR)</label>
                                    <input
                                        type="text"
                                        value={form.seo?.title_fr || ''}
                                        onChange={(e) => updateSection('seo', 'title_fr', e.target.value)}
                                        placeholder="Abdessamad KAF — Ingénieur Full Stack"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">SEO Title (EN)</label>
                                    <input
                                        type="text"
                                        value={form.seo?.title_en || ''}
                                        onChange={(e) => updateSection('seo', 'title_en', e.target.value)}
                                        placeholder="Abdessamad KAF — Full Stack Engineer"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">Rôle / Poste (FR)</label>
                                    <input
                                        type="text"
                                        value={form.seo?.role_fr || ''}
                                        onChange={(e) => updateSection('seo', 'role_fr', e.target.value)}
                                        placeholder="Ingénieur Full Stack"
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">Role / Job Title (EN)</label>
                                    <input
                                        type="text"
                                        value={form.seo?.role_en || ''}
                                        onChange={(e) => updateSection('seo', 'role_en', e.target.value)}
                                        placeholder="Full Stack Engineer"
                                        className={inputClass}
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">Meta Description (FR)</label>
                                    <textarea
                                        rows={3}
                                        value={form.seo?.description_fr || ''}
                                        onChange={(e) => updateSection('seo', 'description_fr', e.target.value)}
                                        className={`${inputClass} resize-none`}
                                        placeholder="Laissez vide pour utiliser la description par défaut..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">Meta Description (EN)</label>
                                    <textarea
                                        rows={3}
                                        value={form.seo?.description_en || ''}
                                        onChange={(e) => updateSection('seo', 'description_en', e.target.value)}
                                        className={`${inputClass} resize-none`}
                                        placeholder="Leave empty to use default description..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">Mots-clés SEO (FR)</label>
                                    <input
                                        type="text"
                                        value={form.seo?.keywords_fr || ''}
                                        onChange={(e) => updateSection('seo', 'keywords_fr', e.target.value)}
                                        placeholder="Ingénieur, Full Stack, React, Node.js..."
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm text-text-sec">SEO Keywords (EN)</label>
                                    <input
                                        type="text"
                                        value={form.seo?.keywords_en || ''}
                                        onChange={(e) => updateSection('seo', 'keywords_en', e.target.value)}
                                        placeholder="Engineer, Full Stack, React, Node.js..."
                                        className={inputClass}
                                    />
                                </div>
                            </div>
                        </section>
                    )}

                    {activeTab === 'notifications' && (
                        <section className="bg-bg-card backdrop-blur-xl border border-border-def p-8 rounded-3xl space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Bell className="text-text-acc" />
                                <h2 className="text-xl font-bold text-text-pri">Notifications & EmailJS</h2>
                            </div>

                            <div className={`p-5 rounded-2xl border flex items-start gap-4 ${
                                emailjsConfigured
                                    ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                            }`}>
                                <Mail size={20} className="mt-0.5 shrink-0" />
                                <div className="text-sm space-y-1">
                                    <p className="font-semibold">
                                        {emailjsConfigured
                                            ? 'Service EmailJS configuré et actif'
                                            : 'Configuration EmailJS incomplète (.env)'}
                                    </p>
                                    <p className="text-xs opacity-80 font-mono">
                                        Service ID: {CONTACT_CONFIG.SERVICE_ID ? '✓ Défini' : '✗ Manquant'} ·
                                        Template ID: {CONTACT_CONFIG.TEMPLATE_ID ? '✓ Défini' : '✗ Manquant'} ·
                                        Public Key: {CONTACT_CONFIG.PUBLIC_KEY ? '✓ Défini' : '✗ Manquant'}
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm text-text-sec">Email de réception des notifications</label>
                                <input
                                    type="email"
                                    value={form.notifications?.recipientEmail || ''}
                                    onChange={(e) => updateSection('notifications', 'recipientEmail', e.target.value)}
                                    placeholder="votre@email.com"
                                    className={inputClass}
                                />
                            </div>

                            <div className="space-y-4">
                                <ToggleRow
                                    label="Activer l'envoi par EmailJS"
                                    description="Envoie un email via EmailJS lorsque le formulaire de contact est soumis."
                                    checked={form.notifications?.emailjsEnabled !== false}
                                    onChange={(v) => updateSection('notifications', 'emailjsEnabled', v)}
                                />
                                <ToggleRow
                                    label="Alertes nouveaux messages"
                                    description="Mettre en évidence les nouveaux messages non lus dans le tableau de bord."
                                    checked={form.notifications?.notifyOnContact !== false}
                                    onChange={(v) => updateSection('notifications', 'notifyOnContact', v)}
                                />
                            </div>
                        </section>
                    )}

                    {activeTab === 'security' && (
                        <section className="bg-bg-card backdrop-blur-xl border border-border-def p-8 rounded-3xl space-y-6">
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className="text-text-acc" />
                                <h2 className="text-xl font-bold text-text-pri">Authentification & Sécurité</h2>
                            </div>

                            <div className="bg-bg-surface/40 p-5 rounded-2xl border border-border-def space-y-2">
                                <p className="text-xs font-mono uppercase tracking-widest text-text-mut">Compte administrateur</p>
                                <p className="text-text-pri font-semibold">{user?.email || 'Non connecté'}</p>
                                {user?.last_sign_in_at && (
                                    <p className="text-xs text-text-sec">
                                        Dernière connexion : {new Date(user.last_sign_in_at).toLocaleString('fr-FR')}
                                    </p>
                                )}
                            </div>

                            <div className="bg-bg-surface/20 p-6 rounded-2xl border border-border-def space-y-4">
                                <div className="flex items-center justify-between gap-4">
                                    <div>
                                        <p className="text-text-pri font-medium">Mot de passe</p>
                                        <p className="text-text-sec text-sm">
                                            Modifiez votre mot de passe pour accéder à la zone d'administration.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordForm((v) => !v);
                                            setPasswordFeedback(null);
                                        }}
                                        className="text-text-acc text-sm hover:underline font-medium shrink-0"
                                    >
                                        {showPasswordForm ? 'Fermer' : 'Changer le mot de passe'}
                                    </button>
                                </div>

                                {passwordFeedback && (
                                    <div className={`p-3 rounded-xl text-sm border ${
                                        passwordFeedback.type === 'success'
                                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                            : 'bg-red-500/10 border-red-500/30 text-red-400'
                                    }`}>
                                        {passwordFeedback.message}
                                    </div>
                                )}

                                {showPasswordForm && (
                                    <form onSubmit={handleChangePassword} className="space-y-4 pt-2 border-t border-border-def">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-sm text-text-sec">Nouveau mot de passe</label>
                                                <input
                                                    type="password"
                                                    required
                                                    minLength={6}
                                                    value={newPassword}
                                                    onChange={(e) => setNewPassword(e.target.value)}
                                                    placeholder="Minimum 6 caractères"
                                                    className={inputClass}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-sm text-text-sec">Confirmer le mot de passe</label>
                                                <input
                                                    type="password"
                                                    required
                                                    minLength={6}
                                                    value={confirmPassword}
                                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                                    placeholder="Répétez le mot de passe"
                                                    className={inputClass}
                                                />
                                            </div>
                                        </div>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            disabled={passwordLoading}
                                            className="flex items-center gap-2"
                                        >
                                            {passwordLoading ? <Loader2 size={16} className="animate-spin" /> : <Lock size={16} />}
                                            <span>Mettre à jour le mot de passe</span>
                                        </Button>
                                    </form>
                                )}
                            </div>

                            <div className="bg-red-500/5 p-6 rounded-2xl border border-red-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <p className="text-text-pri font-medium">Sessions actives</p>
                                    <p className="text-text-sec text-sm">
                                        Révoque tous les jetons de session Supabase sur tous les appareils.
                                    </p>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleGlobalSignOut}
                                    className="px-4 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-sm font-medium inline-flex items-center gap-2 transition-colors shrink-0"
                                >
                                    <LogOut size={16} />
                                    <span>Déconnecter tout</span>
                                </button>
                            </div>
                        </section>
                    )}
                </div>
            </div>
        </div>
    );
}

function SettingsTab({ icon: Icon, label, active = false, onClick }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${active
                ? 'bg-accent/10 border-accent/30 text-text-pri'
                : 'bg-transparent border-transparent text-text-mut hover:bg-bg-card/40 hover:text-text-pri'
            }`}
        >
            <Icon size={20} className={active ? 'text-text-acc' : ''} />
            <span className="font-medium">{label}</span>
        </button>
    );
}

function ToggleRow({ label, description, checked, onChange }) {
    return (
        <label className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-bg-surface/30 border border-border-def cursor-pointer hover:border-accent/30 transition-colors">
            <div>
                <p className="text-sm font-semibold text-text-pri">{label}</p>
                <p className="text-xs text-text-mut mt-0.5">{description}</p>
            </div>
            <div className="relative w-12 h-6 flex items-center shrink-0">
                <input
                    type="checkbox"
                    className="sr-only"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                />
                <div className={`w-full h-full rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-bg-surface border border-border-def'}`} />
                <div className={`absolute left-1 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-6' : ''}`} />
            </div>
        </label>
    );
}
