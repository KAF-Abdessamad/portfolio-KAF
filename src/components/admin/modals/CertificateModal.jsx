import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, Calendar } from 'lucide-react';
import Button from '../../ui/Button';
import UploadZone from '../UploadZone';
import { uploadFile, getPublicUrl } from '../../../lib/storage';
import { translateText } from '../../../utils/translate';

export default function CertificateModal({ isOpen, onClose, onSave, certificate = null }) {
    const initialForm = {
        title: '',
        title_en: '',
        issuer: '',
        issue_date: '',
        expiry_date: '',
        credential_id: '',
        credential_url: '',
        image_url: '',
        category: 'Dev',
        description: '',
        description_en: '',
        featured: false
    };

    const [formData, setFormData] = useState(initialForm);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);

    useEffect(() => {
        if (certificate) {
            setFormData({
                ...initialForm,
                ...certificate,
                title_en: certificate.title_en || '',
                description: certificate.description || '',
                description_en: certificate.description_en || '',
            });
            setPreviewUrl(certificate.image_url || '');
        } else {
            setFormData(initialForm);
            setPreviewUrl('');
        }
        setImageFile(null);
    }, [certificate, isOpen]);

    const handleAutoTranslate = async () => {
        if (!formData.title && !formData.description) return;
        setIsTranslating(true);
        try {
            const [enTitle, enDesc] = await Promise.all([
                formData.title ? translateText(formData.title, 'fr', 'en') : Promise.resolve(''),
                formData.description ? translateText(formData.description, 'fr', 'en') : Promise.resolve('')
            ]);

            setFormData(prev => ({
                ...prev,
                title_en: enTitle || prev.title_en,
                description_en: enDesc || prev.description_en
            }));
        } catch (error) {
            console.error("Auto-translate error:", error);
        } finally {
            setIsTranslating(false);
        }
    };

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

            if (imageFile) {
                const fileName = `cert-${Date.now()}-${imageFile.name}`;
                const { path, error } = await uploadFile('certificates-img', imageFile, fileName);
                if (error) {
                    console.warn("Upload fallback to portfolio-images:", error.message);
                    const fallback = await uploadFile('portfolio-images', imageFile, fileName);
                    if (fallback.error) throw fallback.error;
                    finalImageUrl = getPublicUrl('portfolio-images', fallback.path);
                } else {
                    finalImageUrl = getPublicUrl('certificates-img', path);
                }
            }

            const finalData = {
                ...formData,
                image_url: finalImageUrl
            };

            try {
                await onSave(finalData);
            } catch (saveErr) {
                if (saveErr?.code === '42703' && saveErr.message?.includes('title_en')) {
                    const { title_en, description_en, ...legacyData } = finalData;
                    await onSave(legacyData);
                } else {
                    throw saveErr;
                }
            }
            onClose();
        } catch (error) {
            console.error("Error saving certificate:", error);
            alert("Erreur lors de l'enregistrement du certificat.");
        } finally {
            setIsSaving(false);
        }
    };

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[99999] flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-y-auto">
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
                        className="relative w-full max-w-[95vw] lg:max-w-3xl max-h-[92vh] bg-bg-card border border-border-def rounded-2xl sm:rounded-3xl overflow-hidden flex flex-col shadow-2xl z-10 my-auto"
                    >
                        <div className="p-4 sm:p-6 border-b border-border-def flex items-center justify-between bg-bg-surface/50">
                            <h2 className="text-lg sm:text-xl font-bold text-text-pri">
                                {certificate ? 'Modifier le certificat' : 'Nouveau certificat'}
                            </h2>
                            <div className="flex items-center gap-2 sm:gap-3">
                                <button
                                    type="button"
                                    onClick={handleAutoTranslate}
                                    disabled={isTranslating}
                                    className="text-xs font-bold text-accent hover:text-accent-h flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-accent/10 border border-accent/20 transition-all"
                                >
                                    {isTranslating ? <Loader2 size={14} className="animate-spin" /> : '✨'}
                                    <span className="hidden sm:inline">{isTranslating ? 'Traduction...' : 'Auto-Translate'}</span>
                                </button>
                                <button onClick={onClose} className="p-1.5 sm:p-2 text-text-sec hover:text-text-pri transition-colors">
                                    <X size={20} />
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
                            <form id="cert-form" onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                                <div className="space-y-5 sm:space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text-sec mb-2">Titre (FR)</label>
                                            <input
                                                name="title"
                                                required
                                                value={formData.title}
                                                onChange={handleChange}
                                                className="w-full bg-bg-surface/70 border border-border-def focus:border-accent rounded-xl py-2.5 sm:py-3 px-4 text-text-pri outline-none transition-colors text-sm"
                                                placeholder="ex: AWS Solutions Architect"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-sec mb-2">Title (EN)</label>
                                            <input
                                                name="title_en"
                                                value={formData.title_en || ''}
                                                onChange={handleChange}
                                                className="w-full bg-bg-surface/70 border border-border-def focus:border-accent rounded-xl py-2.5 sm:py-3 px-4 text-text-pri outline-none transition-colors text-sm"
                                                placeholder="Optional EN title"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-sec mb-2">Organisme émetteur</label>
                                        <input
                                            name="issuer"
                                            required
                                            value={formData.issuer}
                                            onChange={handleChange}
                                            className="w-full bg-bg-surface/70 border border-border-def focus:border-accent rounded-xl py-2.5 sm:py-3 px-4 text-text-pri outline-none transition-colors text-sm"
                                            placeholder="ex: Amazon Web Services"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-text-sec mb-2">Date d'émission</label>
                                            <input
                                                type="date"
                                                name="issue_date"
                                                required
                                                value={formData.issue_date}
                                                onChange={handleChange}
                                                className="w-full bg-bg-surface/70 border border-border-def focus:border-accent rounded-xl py-2.5 sm:py-3 px-4 text-text-pri outline-none transition-colors text-sm"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-text-sec mb-2">Date d'expiration</label>
                                            <input
                                                type="date"
                                                name="expiry_date"
                                                value={formData.expiry_date}
                                                onChange={handleChange}
                                                className="w-full bg-bg-surface/70 border border-border-def focus:border-accent rounded-xl py-2.5 sm:py-3 px-4 text-text-pri outline-none transition-colors text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-sec mb-2">Catégorie</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full bg-bg-surface/70 border border-border-def focus:border-accent rounded-xl py-2.5 sm:py-3 px-4 text-text-pri outline-none transition-colors text-sm"
                                        >
                                            <option value="Dev">Développement</option>
                                            <option value="Cloud">Cloud</option>
                                            <option value="Design">Design</option>
                                            <option value="Other">Autre</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-text-sec mb-2">Aperçu / Badge</label>
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

                                    <div>
                                        <label className="block text-sm font-medium text-text-sec mb-2">Credential ID</label>
                                        <input
                                            name="credential_id"
                                            value={formData.credential_id}
                                            onChange={handleChange}
                                            className="w-full bg-bg-surface/70 border border-border-def focus:border-accent rounded-xl py-2.5 sm:py-3 px-4 text-text-pri outline-none transition-colors text-sm"
                                            placeholder="ex: ABC-12345"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-sec mb-2">URL de vérification</label>
                                        <input
                                            name="credential_url"
                                            value={formData.credential_url}
                                            onChange={handleChange}
                                            className="w-full bg-bg-surface/70 border border-border-def focus:border-accent rounded-xl py-2.5 sm:py-3 px-4 text-text-pri outline-none transition-colors text-sm"
                                            placeholder="https://verify..."
                                        />
                                    </div>
                                </div>

                                <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-text-sec mb-2">Description (FR)</label>
                                        <textarea
                                            name="description"
                                            rows={3}
                                            value={formData.description}
                                            onChange={handleChange}
                                            className="w-full bg-bg-surface/70 border border-border-def focus:border-accent rounded-xl py-2.5 sm:py-3 px-4 text-text-pri outline-none transition-colors resize-none text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-text-sec mb-2">Description (EN)</label>
                                        <textarea
                                            name="description_en"
                                            rows={3}
                                            value={formData.description_en}
                                            onChange={handleChange}
                                            className="w-full bg-bg-surface/70 border border-border-def focus:border-accent rounded-xl py-2.5 sm:py-3 px-4 text-text-pri outline-none transition-colors resize-none text-sm"
                                        />
                                    </div>
                                </div>

                                <div className="lg:col-span-2 flex items-center justify-end gap-3 pt-4 border-t border-border-def">
                                    <Button type="button" variant="secondary" onClick={onClose} disabled={isSaving}>
                                        Annuler
                                    </Button>
                                    <Button type="submit" variant="primary" disabled={isSaving} className="flex items-center gap-2">
                                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                                        <span>{certificate ? 'Mettre à jour' : 'Enregistrer'}</span>
                                    </Button>
                                </div>
                            </form>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
