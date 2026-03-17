import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, Plus } from 'lucide-react';
import Button from '../../ui/Button';
import UploadZone from '../UploadZone';
import { uploadFile, getPublicUrl } from '../../../lib/storage';

export default function ProjectModal({ isOpen, onClose, onSave, project = null }) {
    const initialForm = {
        title: '',
        description: '',
        long_description: '',
        tech_stack: '',
        category: 'Web',
        github_url: '',
        live_url: '',
        featured: false,
        order_index: 0,
        image_url: ''
    };

    const [formData, setFormData] = useState(initialForm);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (project) {
            setFormData({
                ...project,
                tech_stack: Array.isArray(project.tech_stack) ? project.tech_stack.join(', ') : project.tech_stack
            });
            setPreviewUrl(project.image_url || '');
        } else {
            setFormData(initialForm);
            setPreviewUrl('');
        }
        setImageFile(null);
    }, [project, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileSelected = (file) => {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let finalImageUrl = formData.image_url;

            // 1. Upload new image if selected
            if (imageFile) {
                const fileName = `${Date.now()}-${imageFile.name}`;
                const { path, error } = await uploadFile('portfolio-images', imageFile, fileName);
                if (error) throw error;
                finalImageUrl = getPublicUrl('portfolio-images', path);
            }

            // 2. Prepare final data
            const finalData = {
                ...formData,
                image_url: finalImageUrl,
                tech_stack: formData.tech_stack.split(',').map(item => item.trim()).filter(Boolean)
            };

            await onSave(finalData);
            onClose();
        } catch (error) {
            console.error("Error saving project:", error);
            alert("Erreur lors de l'enregistrement du projet.");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 20 }}
                        className="relative w-full max-w-4xl max-h-[90vh] bg-secondary border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-primary/20">
                            <h2 className="text-xl font-bold text-white">
                                {project ? 'Modifier le projet' : 'Nouveau projet'}
                            </h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        {/* Form Body */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <form id="project-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Titre du projet</label>
                                        <input
                                            name="title"
                                            required
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                            placeholder="ex: Portfolio 3D"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Catégorie</label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                            >
                                                <option value="Web">Web</option>
                                                <option value="Mobile">Mobile</option>
                                                <option value="3D">3D</option>
                                                <option value="Design">Design</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Ordre d'affichage</label>
                                            <input
                                                type="number"
                                                name="order_index"
                                                value={formData.order_index}
                                                onChange={handleChange}
                                                className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Stack Technique (séparés par des virgules)</label>
                                        <input
                                            name="tech_stack"
                                            value={formData.tech_stack}
                                            onChange={handleChange}
                                            className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                            placeholder="React, Three.js, Tailwind..."
                                        />
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <input
                                            type="checkbox"
                                            id="featured"
                                            name="featured"
                                            checked={formData.featured}
                                            onChange={handleChange}
                                            className="w-5 h-5 rounded border-slate-800 bg-primary text-accent focus:ring-accent"
                                        />
                                        <label htmlFor="featured" className="text-sm text-white">Mettre en avant (Featured)</label>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Image de couverture</label>
                                        <UploadZone
                                            preview={previewUrl}
                                            onFileSelected={handleFileSelected}
                                            onClear={() => {
                                                setImageFile(null);
                                                setPreviewUrl('');
                                                setFormData(prev => ({ ...prev, image_url: '' }));
                                            }}
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">URL GitHub</label>
                                            <input
                                                name="github_url"
                                                value={formData.github_url}
                                                onChange={handleChange}
                                                className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                                placeholder="https://github.com/..."
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Lien Live</label>
                                            <input
                                                name="live_url"
                                                value={formData.live_url}
                                                onChange={handleChange}
                                                className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Description courte</label>
                                    <textarea
                                        name="description"
                                        required
                                        rows={2}
                                        value={formData.description}
                                        onChange={handleChange}
                                        className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors resize-none"
                                        placeholder="Une brève description pour la grille de projets..."
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Description détaillée (Markdown supporté)</label>
                                    <textarea
                                        name="long_description"
                                        rows={5}
                                        value={formData.long_description}
                                        onChange={handleChange}
                                        className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors resize-none"
                                        placeholder="Détails du projet, défis, solutions..."
                                    />
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border-slate-800 flex items-center justify-end gap-4 bg-primary/20">
                            <button
                                onClick={onClose}
                                className="px-6 py-2.5 text-slate-400 hover:text-white transition-colors"
                            >
                                Annuler
                            </button>
                            <Button
                                type="submit"
                                form="project-form"
                                variant="primary"
                                className="flex items-center gap-2 py-2.5 px-8"
                                disabled={isSaving}
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                <span>{project ? 'Mettre à jour' : 'Créer le projet'}</span>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
