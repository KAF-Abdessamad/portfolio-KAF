import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Shield, Terminal, Zap, Layout, Database, Cpu } from 'lucide-react';
import Button from '../../ui/Button';
import { ICON_CONFIG } from '../../../lib/constants/devicons';

const CATEGORIES = ['Languages', 'Frameworks', 'Tools', 'Databases', 'DevOps', 'Concepts'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'Expert'];

export default function SkillModal({ isOpen, onClose, skill, onSave }) {
    const [formData, setFormData] = useState({
        name: '',
        category: 'Languages',
        icon_key: '',
        color: '',
        level: 'Intermediate',
        featured: false,
        order_index: 0
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (skill) {
            setFormData({
                name: skill.name || '',
                category: skill.category || 'Languages',
                icon_key: skill.icon_key || '',
                color: skill.color || '',
                level: skill.level || 'Intermediate',
                featured: skill.featured || false,
                order_index: skill.order_index || 0
            });
        } else {
            setFormData({
                name: '',
                category: 'Languages',
                icon_key: '',
                color: '',
                level: 'Intermediate',
                featured: false,
                order_index: 0
            });
        }
    }, [skill, isOpen]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await onSave(formData);
            onClose();
        } catch (err) {
            console.error("Save error:", err);
            alert("Erreur lors de l'enregistrement.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-primary/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-2xl bg-secondary border border-slate-800 rounded-2xl shadow-2xl overflow-hidden"
                >
                    <div className="p-6 border-b border-slate-800 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-white">
                            {skill ? 'Modifier la compétence' : 'Nouvelle compétence'}
                        </h2>
                        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                            <X size={20} />
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Nom</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-primary border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-accent outline-none"
                                />
                            </div>

                            {/* Category */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Catégorie</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-primary border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-accent outline-none"
                                >
                                    {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                                </select>
                            </div>

                            {/* Icon Key */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Clé d'icône (DevIcon)</label>
                                <input
                                    type="text"
                                    placeholder="e.g. react, nodejs"
                                    value={formData.icon_key}
                                    onChange={(e) => {
                                        const key = e.target.value.toLowerCase();
                                        const config = ICON_CONFIG[key];
                                        setFormData({
                                            ...formData,
                                            icon_key: key,
                                            color: config ? config.color : formData.color
                                        });
                                    }}
                                    className="w-full bg-primary border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-accent outline-none"
                                />
                            </div>

                            {/* Color */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Couleur Hex (#ffffff)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="#61dafb"
                                        value={formData.color}
                                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                        className="flex-1 bg-primary border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-accent outline-none font-mono"
                                    />
                                    <div
                                        className="w-10.5 h-10.5 rounded-xl border border-slate-800"
                                        style={{ backgroundColor: formData.color || 'transparent' }}
                                    />
                                </div>
                            </div>

                            {/* Level */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Niveau</label>
                                <select
                                    value={formData.level}
                                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                                    className="w-full bg-primary border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-accent outline-none"
                                >
                                    {LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                                </select>
                            </div>

                            {/* Order Index */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-slate-400">Index d'ordre</label>
                                <input
                                    type="number"
                                    value={formData.order_index}
                                    onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) })}
                                    className="w-full bg-primary border border-slate-800 rounded-xl px-4 py-2.5 text-white focus:border-accent outline-none"
                                />
                            </div>
                        </div>

                        {/* Featured Toggle */}
                        <label className="flex items-center gap-3 cursor-pointer group">
                            <div className="relative w-12 h-6 flex items-center">
                                <input
                                    type="checkbox"
                                    className="peer hidden"
                                    checked={formData.featured}
                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                />
                                <div className="w-full h-full bg-slate-800 rounded-full peer-checked:bg-accent transition-colors" />
                                <div className={`absolute left-1 w-4 h-4 bg-white rounded-full transition-transform ${formData.featured ? 'translate-x-6' : ''}`} />
                            </div>
                            <span className="text-sm font-medium text-slate-300 group-hover:text-white transition-colors">
                                Mettre en avant (Featured)
                            </span>
                        </label>

                        <div className="pt-6 border-t border-slate-800 flex justify-end gap-4">
                            <Button type="button" variant="secondary" onClick={onClose}>
                                Annuler
                            </Button>
                            <Button
                                type="submit"
                                variant="primary"
                                className="flex items-center gap-2"
                                disabled={isSubmitting}
                            >
                                <Save size={18} />
                                {isSubmitting ? 'Enregistrement...' : 'Enregistrer'}
                            </Button>
                        </div>
                    </form>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
