import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
    FileText,
    Upload,
    Trash2,
    CheckCircle2,
    AlertCircle,
    Languages,
    Eye,
    Loader2
} from 'lucide-react';
import { useCV } from '../../hooks/useCV';
import { supabase } from '../../lib/supabase';
import { uploadFile, getPublicUrl, deleteFile } from '../../lib/storage';
import Button from '../../components/ui/Button';
import UploadZone from '../../components/admin/UploadZone';

export default function CVPage() {
    const { cvUrl: frUrl, loading: loadingFr } = useCV('fr');
    const { cvUrl: enUrl, loading: loadingEn } = useCV('en');

    const [isUploading, setIsUploading] = useState(false);
    const [uploadError, setUploadError] = useState(null);

    const handleUpload = async (file, lang) => {
        setIsUploading(true);
        setUploadError(null);

        try {
            const fileName = `cv-${lang}-${Date.now()}.pdf`;
            const { path, error: storageError } = await uploadFile('cv-files', file, fileName);
            if (storageError) throw storageError;

            const publicUrl = getPublicUrl('cv-files', path);

            // Deactivate previous active CV for this language
            await supabase
                .from('cv')
                .update({ is_active: false })
                .eq('language', lang);

            // Insert new record
            const { error: dbError } = await supabase
                .from('cv')
                .insert([
                    {
                        file_url: publicUrl,
                        language: lang,
                        version: new Date().toLocaleDateString(),
                        is_active: true
                    }
                ]);

            if (dbError) throw dbError;

            alert(`CV ${lang.toUpperCase()} mis à jour avec succès !`);
        } catch (err) {
            console.error(err);
            setUploadError("Erreur lors de l'upload.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-white">Gestion du CV</h1>
                <p className="text-slate-400 mt-1">Mettez à jour vos résumés PDF pour chaque langue.</p>
            </div>

            {uploadError && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl flex items-center gap-3">
                    <AlertCircle size={20} />
                    <p>{uploadError}</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* French CV Card */}
                <CVCard
                    title="Version Française"
                    lang="fr"
                    currentUrl={frUrl}
                    loading={loadingFr}
                    onUpload={(file) => handleUpload(file, 'fr')}
                    isBusy={isUploading}
                />

                {/* English CV Card */}
                <CVCard
                    title="English Version"
                    lang="en"
                    currentUrl={enUrl}
                    loading={loadingEn}
                    onUpload={(file) => handleUpload(file, 'en')}
                    isBusy={isUploading}
                />
            </div>
        </div>
    );
}

function CVCard({ title, lang, currentUrl, onUpload, loading, isBusy }) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-secondary/30 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl flex flex-col space-y-6"
        >
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center text-accent">
                        <FileText size={24} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">{title}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                            <Languages size={14} className="text-slate-500" />
                            <span className="text-xs text-slate-500 font-medium uppercase">{lang}</span>
                        </div>
                    </div>
                </div>

                {currentUrl && (
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-full text-[10px] font-bold uppercase tracking-wider">
                        Actif
                    </span>
                )}
            </div>

            {/* Preview Section */}
            <div className="flex-1 min-h-[160px] bg-primary/40 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-6 text-center">
                {loading ? (
                    <Loader2 className="animate-spin text-slate-600" size={32} />
                ) : currentUrl ? (
                    <>
                        <CheckCircle2 size={40} className="text-emerald-500 mb-3" />
                        <p className="text-white font-medium mb-1">CV actuel en ligne</p>
                        <a
                            href={currentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-accent text-sm hover:underline flex items-center gap-1.5"
                        >
                            <Eye size={14} /> Voir le document
                        </a>
                    </>
                ) : (
                    <p className="text-slate-500 italic">Aucun CV configuré pour cette langue.</p>
                )}
            </div>

            {/* Upload Zone */}
            <div className="pt-4">
                <UploadZone
                    accept=".pdf"
                    maxSizeMB={10}
                    onFileSelected={onUpload}
                />
            </div>
        </motion.div>
    );
}
