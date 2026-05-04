import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, GraduationCap, Plus, Trash2, Languages, Sparkles } from 'lucide-react';
import Button from '../../ui/Button';
import { translateText } from '../../../utils/translate';

const EMPTY_FORM = {
    degree: '',
    degree_en: '',
    school: '',
    school_en: '',
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

    useEffect(() => {
        if (experience) {
            setFormData({
                degree: experience.degree || '',
                degree_en: experience.degree_en || '',
                school: experience.school || '',
                school_en: experience.school_en || '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            console.error('Save error:', err);
            alert("Erreur lors de l'enregistrement.");
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
                translateText(formData.degree, 'fr', 'en'),
                translateText(formData.school, 'fr', 'en'),
                translateText(formData.description, 'fr', 'en'),
                translateText(formData.badge, 'fr', 'en')
            ]);
            
            // Translate highlights
            const tHighlights = await Promise.all(
                formData.highlights.map(h => translateText(h, 'fr', 'en'))
            );

            setFormData(prev => ({
                ...prev,
                degree_en: tDegree,
                school_en: tSchool,
                description_en: tDesc,
                badge_en: tBadge,
                highlights_en: tHighlights
            }));
        } catch (err) {
            console.error("Auto-translate error:", err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const inputClass = "w-full bg-bg-surface border border-border-def rounded-xl px-4 py-2.5 text-text-primary focus:border-text-acc outline-none transition-colors";

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                {/* Backdrop */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-bg-primary/80 backdrop-blur-md"
                />

                {/* Modal */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-bg-card border border-border-def rounded-2xl shadow-2xl"
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-bg-card p-6 border-b border-border-def flex items-center justify-between z-10">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-text-acc/10 flex items-center justify-center">
                                <GraduationCap size={18} className="text-text-acc" />
                            </div>
                            <h2 className="text-xl font-bold text-text-primary">
                                {experience ? 'Modifier l\'expérience' : 'Nouvelle expérience'}
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
                            <button onClick={onClose} className="p-2 text-text-sec hover:text-text-primary transition-colors rounded-lg hover:bg-bg-surface">
                                <X size={20} />
                            </button>
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-5">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">Diplôme (FR) *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="ex: Licence — Informatique"
                                        value={formData.degree}
                                        onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">Degree (EN)</label>
                                    <input
                                        type="text"
                                        placeholder="ex: Bachelor's Degree — Computer Science"
                                        value={formData.degree_en}
                                        onChange={(e) => setFormData({ ...formData, degree_en: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* École */}
                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">École (FR) *</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="ex: Faculté des Sciences"
                                        value={formData.school}
                                        onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">School (EN)</label>
                                    <input
                                        type="text"
                                        placeholder="ex: Faculty of Sciences"
                                        value={formData.school_en}
                                        onChange={(e) => setFormData({ ...formData, school_en: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Localisation */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-sec">Localisation</label>
                                <input
                                    type="text"
                                    placeholder="ex: Rabat, Maroc"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            {/* Période */}
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-text-sec">Période *</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="ex: 2020 — 2023"
                                    value={formData.period}
                                    onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                                    className={inputClass}
                                />
                            </div>

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">Badge FR (niveau)</label>
                                    <input
                                        type="text"
                                        placeholder="ex: Bac+3"
                                        value={formData.badge}
                                        onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">Badge EN</label>
                                    <input
                                        type="text"
                                        placeholder="ex: 3rd Year"
                                        value={formData.badge_en}
                                        onChange={(e) => setFormData({ ...formData, badge_en: e.target.value })}
                                        className={inputClass}
                                    />
                                </div>
                            </div>

                            {/* Ordre */}
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

                            <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-text-sec">Description (FR)</label>
                                    <textarea
                                        rows={3}
                                        placeholder="Description en français..."
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

                            {/* Highlights */}
                            <div className="md:col-span-2 space-y-2">
                                <label className="text-sm font-medium text-text-sec">Points clés (badges)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="ex: Développement Full Stack"
                                        value={highlightInput}
                                        onChange={(e) => setHighlightInput(e.target.value)}
                                        onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addHighlight(); } }}
                                        className={`${inputClass} flex-1`}
                                    />
                                    <button
                                        type="button"
                                        onClick={addHighlight}
                                        className="px-4 py-2.5 bg-text-acc/10 text-text-acc rounded-xl hover:bg-text-acc/20 transition-colors border border-text-acc/20"
                                    >
                                        <Plus size={18} />
                                    </button>
                                </div>
                                {formData.highlights.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {formData.highlights.map((h, i) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1.5 text-xs font-mono text-text-mut bg-bg-surface px-3 py-1 rounded border border-border-def"
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
                                disabled={isSubmitting}
                            >
                                <Save size={16} />
                                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
