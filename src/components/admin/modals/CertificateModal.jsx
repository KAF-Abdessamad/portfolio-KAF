import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Loader2, Calendar } from 'lucide-react';
import Button from '../../ui/Button';
import UploadZone from '../UploadZone';
import { uploadFile, getPublicUrl } from '../../../lib/storage';

export default function CertificateModal({ isOpen, onClose, onSave, certificate = null }) {
    const initialForm = {
        title: '',
        issuer: '',
        issue_date: '',
        expiry_date: '',
        credential_id: '',
        credential_url: '',
        image_url: '',
        category: 'Dev',
        featured: false
    };

    const [formData, setFormData] = useState(initialForm);
    const [imageFile, setImageFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState('');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (certificate) {
            setFormData({ ...certificate });
            setPreviewUrl(certificate.image_url || '');
        } else {
            setFormData(initialForm);
            setPreviewUrl('');
        }
        setImageFile(null);
    }, [certificate, isOpen]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            let finalImageUrl = formData.image_url;

            if (imageFile) {
                const fileName = `cert-${Date.now()}-${imageFile.name}`;
                const { path, error } = await uploadFile('certificates-img', imageFile, fileName);
                if (error) throw error;
                finalImageUrl = getPublicUrl('certificates-img', path);
            }

            const finalData = { ...formData, image_url: finalImageUrl };
            await onSave(finalData);
            onClose();
        } catch (error) {
            console.error("Error saving certificate:", error);
            alert("Erreur lors de l'enregistrement du certificat.");
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
                        className="relative w-full max-w-3xl bg-secondary border border-slate-800 rounded-3xl overflow-hidden flex flex-col shadow-2xl"
                    >
                        <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-primary/20">
                            <h2 className="text-xl font-bold text-white">
                                {certificate ? 'Modifier le certificat' : 'Nouveau certificat'}
                            </h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-8">
                            <form id="cert-form" onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Titre du certificat</label>
                                        <input
                                            name="title"
                                            required
                                            value={formData.title}
                                            onChange={handleChange}
                                            className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                            placeholder="ex: AWS Solutions Architect"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Organisme émetteur</label>
                                        <input
                                            name="issuer"
                                            required
                                            value={formData.issuer}
                                            onChange={handleChange}
                                            className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                            placeholder="ex: Amazon Web Services"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Date d'émission</label>
                                            <input
                                                type="date"
                                                name="issue_date"
                                                required
                                                value={formData.issue_date}
                                                onChange={handleChange}
                                                className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-2">Date d'expiration</label>
                                            <input
                                                type="date"
                                                name="expiry_date"
                                                value={formData.expiry_date}
                                                onChange={handleChange}
                                                className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Catégorie</label>
                                        <select
                                            name="category"
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
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
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Aperçu / Badge</label>
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
                                        <label className="block text-sm font-medium text-slate-400 mb-2">Credential ID</label>
                                        <input
                                            name="credential_id"
                                            value={formData.credential_id}
                                            onChange={handleChange}
                                            className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-2">URL de vérification</label>
                                        <input
                                            name="credential_url"
                                            value={formData.credential_url}
                                            onChange={handleChange}
                                            className="w-full bg-primary border border-slate-800 focus:border-accent rounded-xl py-3 px-4 text-white outline-none transition-colors"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>
                            </form>
                        </div>

                        <div className="p-6 border-t border-slate-800 flex items-center justify-end gap-4 bg-primary/20">
                            <button onClick={onClose} className="px-6 py-2.5 text-slate-400 hover:text-white transition-colors">
                                Annuler
                            </button>
                            <Button
                                type="submit"
                                form="cert-form"
                                variant="primary"
                                className="flex items-center gap-2 py-2.5 px-8"
                                disabled={isSaving}
                            >
                                {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                                <span>{certificate ? 'Mettre à jour' : 'Enregistrer'}</span>
                            </Button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
}
