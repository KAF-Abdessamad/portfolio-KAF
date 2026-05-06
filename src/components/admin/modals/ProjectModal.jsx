import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, Plus, ImagePlus, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import UploadZone from '../UploadZone';
import { uploadFile, getPublicUrl } from '../../../lib/storage';
import { translateText } from '../../../utils/translate';

export default function ProjectModal({ isOpen, onClose, onSave, project = null }) {
    const initialForm = {
        title: '',
        title_en: '',
        description: '',
        description_en: '',
        long_description: '',
        long_description_en: '',
        tech_stack: '',
        category: 'Web',
        github_url: '',
        live_url: '',
        image_url: '',
        project_images: [],
        has_github: true,
        featured: false,
        order_index: 0
    };

    const [formData, setFormData] = useState(initialForm);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);

    const handleAutoTranslate = async () => {
        if (!formData.title && !formData.description && !formData.long_description) {
            alert("Veuillez remplir au moins un champ en français avant de traduire.");
            return;
        }

        setIsTranslating(true);
        try {
            // Translate fields independently to avoid one failure blocking everything
            const results = await Promise.all([
                formData.title ? translateText(formData.title, 'fr', 'en') : Promise.resolve(''),
                formData.description ? translateText(formData.description, 'fr', 'en') : Promise.resolve(''),
                formData.long_description ? translateText(formData.long_description, 'fr', 'en') : Promise.resolve('')
            ]);

            const [enTitle, enDesc, enLongDesc] = results;

            // Check if any translation actually happened (api might return original text on failure)
            const nothingChanged = 
                (formData.title && enTitle === formData.title) && 
                (formData.description && enDesc === formData.description);

            if (nothingChanged && (formData.title || formData.description)) {
                alert("La traduction a renvoyé le texte original. L'API est peut-être saturée. Veuillez réessayer dans quelques instants.");
            }

            setFormData(prev => ({
                ...prev,
                title_en: enTitle || prev.title_en,
                description_en: enDesc || prev.description_en,
                long_description_en: enLongDesc || prev.long_description_en
            }));
        } catch (error) {
            console.error("Translation failed:", error);
            alert("Erreur lors de la traduction. Vérifiez votre connexion ou réessayez plus tard.");
        } finally {
            setIsTranslating(false);
        }
    };

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

    const handleProjectImageSelected = (file) => {
        const newImage = {
            file,
            preview: URL.createObjectURL(file),
            id: Date.now()
        };
        setFormData(prev => ({
            ...prev,
            project_images: [...(prev.project_images || []), newImage]
        }));
    };

    const handleRemoveProjectImage = (id) => {
        setFormData(prev => ({
            ...prev,
            project_images: prev.project_images.filter(img => img.id !== id)
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let finalImageUrl = formData.image_url;

            // 1. Upload cover image if selected
            if (imageFile) {
                const fileName = `${Date.now()}-${imageFile.name}`;
                const { path, error } = await uploadFile('portfolio-images', imageFile, fileName);
                if (error) throw error;
                finalImageUrl = getPublicUrl('portfolio-images', path);
            }

            // 2. Upload additional project images
            const uploadedProjectImages = [];
            if (formData.project_images?.length > 0) {
                for (const img of formData.project_images) {
                    if (img.file) {
                        const fileName = `proj-${Date.now()}-${img.id}-${img.file.name}`;
                        const { path, error } = await uploadFile('portfolio-images', img.file, fileName);
                        if (error) throw error;
                        uploadedProjectImages.push(getPublicUrl('portfolio-images', path));
                    } else {
                        // Keep existing URLs (when editing)
                        uploadedProjectImages.push(img.preview || img);
                    }
                }
            }

            // 3. Prepare final data
            const finalData = {
                ...formData,
                image_url: finalImageUrl,
                project_images: uploadedProjectImages,
                tech_stack: formData.tech_stack.split(',').map(item => item.trim()).filter(Boolean)
            };

            await onSave(finalData);
            onClose();
        } catch (error) {
            console.error("Error saving project:", error);
            const message =
                (typeof error?.message === 'string' && error.message.trim()) ||
                (typeof error === 'string' && error.trim()) ||
                "Erreur inconnue";
            alert(`Erreur lors de l'enregistrement du projet.\n\nDétail: ${message}`);
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
                        className="relative w-full max-w-4xl max-h-[90vh] bg-bg-surface border border rounded-3xl overflow-hidden flex flex-col shadow-2xl"
                    >
                        {/* Header */}
                        <div className="p-6 border-b border flex items-center justify-between bg-bg-card/20">
                            <h2 className="text-xl font-bold text-white">
                                {project ? 'Modifier le projet' : 'Nouveau projet'}
                            </h2>
                            <div className="flex items-center gap-4">
                                <button 
                                    type="button"
                                    onClick={handleAutoTranslate}
                                    disabled={isTranslating}
                                    className="text-xs font-bold text-accent hover:text-accent-h flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 transition-all"
                                >
                                    {isTranslating ? <Loader2 size={14} className="animate-spin" /> : '✨'}
                                    {isTranslating ? 'Traduction...' : 'Auto-Translate (FR ➔ EN)'}
                                </button>
                                <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Form Body */}
                        <div className="flex-1 overflow-y-auto p-8">
                            <form id="project-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Titre (FR)</label>
                                            <input
                                                name="title"
                                                required
                                                value={formData.title}
                                                onChange={handleChange}
                                                className="w-full bg-bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                                placeholder="ex: Portfolio 3D"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Titre (EN)</label>
                                            <input
                                                name="title_en"
                                                required
                                                value={formData.title_en}
                                                onChange={handleChange}
                                                className="w-full bg-bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                                placeholder="ex: 3D Portfolio"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Catégorie</label>
                                            <select
                                                name="category"
                                                value={formData.category}
                                                onChange={handleChange}
                                                className="w-full bg-bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
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
                                                className="w-full bg-bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Stack Technique (séparés par des virgules)</label>
                                        <input
                                            name="tech_stack"
                                            value={formData.tech_stack}
                                            onChange={handleChange}
                                            className="w-full bg-bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                            placeholder="React, Three.js, Tailwind..."
                                        />
                                    </div>

                                    <div className="flex items-center gap-4 pt-2">
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="has_github"
                                                name="has_github"
                                                checked={formData.has_github}
                                                onChange={handleChange}
                                                className="w-5 h-5 rounded border-slate-800 bg-bg-primary text-text-accent focus:ring-accent"
                                            />
                                            <label htmlFor="has_github" className="text-sm text-white">Projet sur GitHub</label>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                id="featured"
                                                name="featured"
                                                checked={formData.featured}
                                                onChange={handleChange}
                                                className="w-5 h-5 rounded border-slate-800 bg-bg-primary text-text-accent focus:ring-accent"
                                            />
                                            <label htmlFor="featured" className="text-sm text-white">Mettre en avant (Featured)</label>
                                        </div>
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

                                    {/* Additional Project Images */}
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">
                                            Images du projet ({formData.project_images?.length || 0})
                                        </label>

                                        {/* Image Gallery Preview */}
                                        {formData.project_images?.length > 0 && (
                                            <div className="grid grid-cols-3 gap-2 mb-3">
                                                {formData.project_images.map((img, idx) => (
                                                    <div key={img.id || idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-700 bg-bg-primary">
                                                        <img
                                                            src={img.preview || img}
                                                            alt={`Preview ${idx + 1}`}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveProjectImage(img.id || idx)}
                                                            className="absolute top-1 right-1 p-1 bg-red-500/80 hover:bg-red-600 text-white rounded-md transition-colors"
                                                        >
                                                            <Trash2 size={12} />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {/* Add Image Button */}
                                        <div className="relative">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={(e) => {
                                                    const files = Array.from(e.target.files);
                                                    files.forEach(handleProjectImageSelected);
                                                }}
                                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            />
                                            <div className="flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-slate-700 hover:border-accent/50 rounded-xl bg-bg-primary/50 transition-colors">
                                                <ImagePlus size={20} className="text-slate-400" />
                                                <span className="text-sm text-slate-400">Ajouter des images</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        {formData.has_github && (
                                            <div>
                                                <label className="block text-sm font-medium text-slate-400 mb-2">URL GitHub</label>
                                                <input
                                                    name="github_url"
                                                    value={formData.github_url}
                                                    onChange={handleChange}
                                                    className="w-full bg-bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                                    placeholder="https://github.com/..."
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Lien Live</label>
                                            <input
                                                name="live_url"
                                                value={formData.live_url}
                                                onChange={handleChange}
                                                className="w-full bg-bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                                placeholder="https://..."
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Description courte (FR)</label>
                                        <textarea
                                            name="description"
                                            required
                                            rows={2}
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full bg-bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors resize-none"
                                            placeholder="Une brève description..."
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Description courte (EN)</label>
                                        <textarea
                                            name="description_en"
                                            required
                                            rows={2}
                                            value={formData.description_en}
                                            onChange={handleChange}
                                            className="w-full bg-bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors resize-none"
                                            placeholder="A brief description..."
                                        />
                                    </div>
                                </div>

                                <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Détails (FR)</label>
                                        <textarea
                                            name="long_description"
                                            rows={4}
                                            value={formData.long_description}
                                            onChange={handleChange}
                                            className="w-full bg-bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors resize-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Détails (EN)</label>
                                        <textarea
                                            name="long_description_en"
                                            rows={4}
                                            value={formData.long_description_en}
                                            onChange={handleChange}
                                            className="w-full bg-bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors resize-none"
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        {/* Footer */}
                        <div className="p-6 border-t border flex items-center justify-end gap-4 bg-bg-card/20">
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


