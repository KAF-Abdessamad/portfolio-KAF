import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Check, Loader2, FileText, Globe } from 'lucide-react';
import { useCV } from '../../hooks/useCV';
import Button from '../../components/ui/Button';

export default function CVDownload() {
    const [activeLang, setActiveLang] = useState('fr');
    const { cvUrl, cvData, loading, trackDownload } = useCV(activeLang);
    const [downloading, setDownloading] = useState(false);
    const [showCheck, setShowCheck] = useState(false);

    const handleDownload = async () => {
        if (!cvUrl) return;

        setDownloading(true);
        try {
            // Track download in DB
            await trackDownload(cvData.id);

            // Trigger file download
            const response = await fetch(cvUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `CV_Abdessamad_KAF_${activeLang.toUpperCase()}.pdf`;
            document.body.appendChild(link);
            link.click();
            link.remove();

            // Show success animation
            setShowCheck(true);
            setTimeout(() => setShowCheck(false), 2000);
        } catch (error) {
            console.error("Download failed:", error);
            alert("Erreur lors du téléchargement. Veuillez réessayer.");
        } finally {
            setDownloading(false);
        }
    };

    return (
        <div className="bg-secondary/10 border border-slate-800 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-secondary/5 rounded-full blur-3xl" />

            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                {/* CV Preview Image (Teaser) */}
                <motion.div
                    whileHover={{ scale: 1.05, rotate: -2 }}
                    className="w-32 h-44 bg-slate-900 rounded-xl border border-slate-700 shadow-2xl overflow-hidden flex-shrink-0 relative group/preview"
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end justify-center pb-4 opacity-0 group-hover/preview:opacity-100 transition-opacity">
                        <FileText className="text-secondary" size={24} />
                    </div>
                    {/* Placeholder for real preview thumbnail */}
                    <div className="w-full h-full flex flex-col p-3 space-y-2 opacity-40">
                        <div className="h-2 w-full bg-slate-700 rounded" />
                        <div className="h-2 w-3/4 bg-slate-700 rounded" />
                        <div className="h-2 w-1/2 bg-slate-700 rounded" />
                        <div className="h-20 w-full bg-slate-800 rounded" />
                        <div className="h-2 w-full bg-slate-700 rounded" />
                    </div>
                </motion.div>

                <div className="flex-1 space-y-4">
                    <div>
                        <h3 className="text-2xl font-bold text-white mb-2">Curriculum Vitæ</h3>
                        <p className="text-slate-400 max-w-md">
                            Téléchargez mon CV pour en savoir plus sur mon parcours et mes compétences techniques.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
                        {/* Language Selection */}
                        <div className="flex bg-primary/40 p-1 rounded-xl border border-slate-800">
                            <button
                                onClick={() => setActiveLang('fr')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeLang === 'fr' ? 'bg-secondary text-primary' : 'text-slate-400 hover:text-white'}`}
                            >
                                FR
                            </button>
                            <button
                                onClick={() => setActiveLang('en')}
                                className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeLang === 'en' ? 'bg-secondary text-primary' : 'text-slate-400 hover:text-white'}`}
                            >
                                EN
                            </button>
                        </div>

                        {/* Download Button */}
                        <Button
                            variant="primary"
                            className="relative min-w-[180px] h-11"
                            onClick={handleDownload}
                            disabled={loading || downloading || !cvUrl}
                        >
                            <AnimatePresence mode="wait">
                                {loading ? (
                                    <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                        <Loader2 className="animate-spin" size={18} />
                                    </motion.div>
                                ) : showCheck ? (
                                    <motion.div key="check" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                                        <Check size={20} className="text-primary font-bold" />
                                    </motion.div>
                                ) : (
                                    <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                        <Download size={18} />
                                        <span>Download CV</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </Button>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-xs font-mono text-slate-500 uppercase tracking-widest pt-2">
                        <div className="flex items-center gap-2">
                            <Download size={12} className="text-secondary" />
                            <span>{cvData?.download_count || 0} téléchargements</span>
                        </div>
                        {cvData?.updated_at && (
                            <div className="flex items-center gap-2">
                                <Check size={12} className="text-green-500" />
                                <span>Mis à jour le {new Date(cvData.updated_at).toLocaleDateString()}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
