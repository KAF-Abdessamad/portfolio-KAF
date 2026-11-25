import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, GraduationCap, Briefcase, Plus, Trash2, Languages, Sparkles, Image } from 'lucide-react';
import Button from '../../ui/Button';
import UploadZone from '../UploadZone';
import { uploadFile, getPublicUrl } from '../../../lib/storage';
import { translateText } from '../../../utils/translate';

const EMPTY_FORM = {
    type: 'stage',
    degree: '',
    degree_en: '',
    school: '',
    school_en: '',
    logo_url: '',
    location: '',
    period: '',
    description: '',
    description_en: '',
    badge: '',
    badge_en: '',
    highlights: [],
    highlights_en: [],
    order_index: 0,
};

export default function ExperienceModal({ isOpen, onClose, experience, onSave }) {
    const [formData, setFormData] = useState(EMPTY_FORM);
    const [highlightInput, setHighlightInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isUploadingLogo, setIsUploadingLogo] = useState(false);

    useEffect(() => {
        if (experience) {
            setFormData({
                type: experience.type || 'stage',
                degree: experience.degree || '',
                degree_en: experience.degree_en || '',
                school: experience.school || '',
                school_en: experience.school_en || '',
                logo_url: experience.logo_url || '',
                location: experience.location || '',
                period: experience.period || '',
                description: experience.description || '',
                description_en: experience.description_en || '',
                badge: experience.badge || '',
                badge_en: experience.badge_en || '',
                highlights: Array.isArray(experience.highlights) ? experience.highlights : [],
                highlights_en: Array.isArray(experience.highlights_en) ? experience.highlights_en : [],
                order_index: experience.order_index ?? 0,
            });
        } else {
            setFormData(EMPTY_FORM);
        }
        setHighlightInput('');
    }, [experience, isOpen]);

    const handleLogoUpload = async (file) => {
        setIsUploadingLogo(true);
        try {
            const fileName = `logo-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
            const { path, error } = await uploadFile('portfolio-images', file, fileName);
            if (error) throw error;
            const publicUrl = `${getPublicUrl('portfolio-images', path)}?v=${Date.now()}`;
            setFormData((prev) => ({ ...prev, logo_url: publicUrl }));
        } catch (err) {
            console.error('Logo upload error:', err);
            alert(err?.message || "Erreur lors de l'upload du logo");
        } finally {
            setIsUploadingLogo(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            console.error('Save error:', err);
            alert("Erreur lors de l'enregistrement : " + (err?.message || 'Erreur inconnue'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const addHighlight = () => {
        const trimmed = highlightInput.trim();
        if (trimmed && !formData.highlights.includes(trimmed)) {
            setFormData(prev => ({ ...prev, highlights: [...prev.highlights, trimmed] }));
        }
        setHighlightInput('');
    };

    const removeHighlight = (index) => {
        setFormData(prev => ({
            ...prev,
            highlights: prev.highlights.filter((_, i) => i !== index),
        }));
    };

    const handleAutoTranslate = async () => {
        if (!formData.degree && !formData.school && !formData.description) return;
        setIsSubmitting(true);
        try {
            const [tDegree, tSchool, tDesc, tBadge] = await Promise.all([
                formData.degree ? translateText(formData.degree, 'fr', 'en') : Promise.resolve(''),
                formData.school ? translateText(formData.school, 'fr', 'en') : Promise.resolve(''),
                formData.description ? translateText(formData.description, 'fr', 'en') : Promise.resolve(''),
                formData.badge ? translateText(formData.badge, 'fr', 'en') : Promise.resolve('')
            ]);
            
            const tHighlights = await Promise.all(
                formData.highlights.map(h => translateText(h, 'fr', 'en'))
            );

            setFormData(prev => ({
                ...prev,
                degree_en: tDegree || prev.degree_en,
                school_en: tSchool || prev.school_en,
                description_en: tDesc || prev.description_en,
                badge_en: tBadge || prev.badge_en,
                highlights_en: tHighlights.filter(Boolean),
            }));
        } catch (err) {
            console.error('Translation error:', err);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    const inputClass = "w-full bg-bg-surface/60 border border-border-def rounded-xl px-4 py-2.5 text-text-pri outline-none focus:border-accent transition-colors text-sm";

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/85 backdrop-blur-md"
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-bg-card border border-border-def rounded-3xl shadow-2xl z-10 my-auto"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-bg-card p-6 border-b border-border-def flex items-center justify-between z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center text-text-acc">
                                {formData.type === 'stage' ? <Briefcase size={18} /> : <GraduationCap size={18} />}
                            </div>
                            <h2 className="text-xl font-bold text-text-pri">
                                {experience ? 'Modifier l\'entrée' : 'Nouvelle entrée'}
                            </h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={handleAutoTranslate}
                                disabled={isSubmitting}
                                className="flex items-center gap-2 px-3 py-1.5 bg-accent/10 text-text-acc rounded-lg hover:bg-accent/20 transition-all text-xs font-bold border border-accent/20"
                                title="Traduire automatiquement vers l'anglais"
                            >
                                <Sparkles size={14} className="text-text-acc" />
                                <span>Traduction Magique</span>
                            </button>
                            <button onClick={onClose} className="p-2 text-text-sec hover:text-text-pri transition-colors rounded-lg hover:bg-bg-surface">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            {/* Type (Stage vs Formation) */}
                            <div className="md:col-span-2 space-y-1.5">
                                <label className="text-sm font-medium text-text-sec">Type d'entrée *</label>
                                <div className="flex gap-6 p-3 bg-bg-surface/50 border border-border-def rounded-xl">
                                    <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-text-pri">
                                        <input
                                            type="radio"
                                            name="entry_type"
                                            value="stage"
                                            checked={formData.type === 'stage'}
                                            onChange={() => setFormData({ ...formData, type: 'stage' })}
                                            className="text-accent focus:ring-accent w-4 h-4"
                                        />
                                        <span>Stage / Expérience professionnelle</span>
                                    </label>
                                    <label className="flex items-center gap-2.5 cursor-pointer text-sm font-medium text-text-pri">
                                        <input
                                            type="radio"
                                            name="entry_type"
                                            value="formation"
                                            checked={formData.type === 'formation'}
                                            onChange={() => setFormData({ ...formData, type: 'formation' })}
                                            className="text-accent focus:ring-accent w-4 h-4"
                                        />
                                        <span>Formation / Éducation académique</span>
                                    </label>
                                </div>
                            </div>

                            {/* Titre / Diplôme */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">
                                        {formData.type === 'stage' ? "Poste / Rôle (FR) *" : "Diplôme / Filière (FR) *"}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder={formData.type === 'stage' ? "ex: Développeur Web Full Stack" : "ex: Cycle d'Ingénieur en Informatique"}
                                        value={formData.degree}
                                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">
                                        {formData.type === 'stage' ? "Role (EN)" : "Degree (EN)"}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={formData.type === 'stage' ? "ex: Full Stack Web Developer" : "ex: Software Engineering Degree"}
                                        value={formData.degree_en}
                                        onChange={(e) => setFormData({ ...formData, degree_en: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Établissement / Entreprise */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">
                                        {formData.type === 'stage' ? "Entreprise (FR) *" : "École / Université (FR) *"}
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder={formData.type === 'stage' ? "ex: Opmobility Lighting" : "ex: Université Privée de Fès"}
                                        value={formData.school}
                                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">
                                        {formData.type === 'stage' ? "Company (EN)" : "School / University (EN)"}
                                    </label>
                                    <input
                                        type="text"
                                        placeholder={formData.type === 'stage' ? "Company name" : "University name"}
                                        value={formData.school_en}
                                        onChange={(e) => setFormData({ ...formData, school_en: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Logo Upload Zone (Supabase Storage + URL en base) */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-text-sec flex items-center gap-2">
                                    <Image size={15} className="text-text-acc" />
                                    <span>Logo de l'entreprise ou de l'école (affiché à côté du titre)</span>
                                </label>
                                <UploadZone
                                    preview={formData.logo_url || null}
                                    onFileSelected={handleLogoUpload}
                                    onClear={() => setFormData(prev => ({ ...prev, logo_url: '' }))}
                                />
                                {isUploadingLogo && (
                                    <p className="text-xs text-text-acc font-mono">Téléversement du logo dans Supabase Storage...</p>
                                )}
                            </div>

                            {/* Localisation & Période */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-sec">Localisation</label>
                                <input
                                    type="text"
                                    placeholder="ex: Tanger, Maroc"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-sec">Période *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="ex: Mars 2025 ou 2023 — 2025"
                                    value={formData.period}
                                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            {/* Badge & Ordre */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">Badge FR</label>
                                    <input
                                        type="text"
                                        placeholder={formData.type === 'stage' ? "ex: Stage" : "ex: Bac+5"}
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">Badge EN</label>
                                    <input
                                        type="text"
                                        placeholder={formData.type === 'stage' ? "ex: Internship" : "ex: Master's"}
                                        value={formData.badge_en}
                                        onChange={(e) => setFormData({ ...formData, badge_en: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-sec">Ordre d'affichage</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={formData.order_index}
                                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
                                    className={inputClass}
                                />
                            </div>

                            {/* Descriptions */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">Description (FR)</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Description des missions ou cours..."
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">Description (EN)</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Description in english..."
                                        value={formData.description_en}
                                        onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                                        className={`${inputClass} resize-none`}
                                    />
                                </div>
                            </div>

                            {/* Points clés (highlights) */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-text-sec">Points clés / Compétences (badges)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="ex: React.js, MySQL, Scrum..."
                                        value={highlightInput}
                                        onChange={(e) => setHighlightInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
                                        className={`${inputClass} flex-1`}
                                    />
                                    <button
                                        type="button"
                                        onClick={addHighlight}
                                        className="px-4 py-2.5 bg-accent/10 text-text-acc rounded-xl hover:bg-accent/20 transition-colors border border-accent/20"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                {formData.highlights.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.highlights.map((h, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1.5 text-xs font-mono text-text-mut bg-bg-surface px-3 py-1 rounded-lg border border-border-def"
                                            >
                                                {h}
                                                <button
                                                    type="button"
                                                    onClick={() => removeHighlight(i)}
                                                    className="text-text-mut hover:text-red-400 transition-colors"
                                                >
                                                    <X size={12} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Footer */}
                        <div className="pt-4 border-t border-border-def flex justify-end gap-3">
                            <Button type="button" variant="secondary" onClick={onClose}>
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex items-center gap-2"
                                disabled={isSubmitting || isUploadingLogo}
                            >
                                <Save size={16} />
                                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>,
        document.body
    );
}
