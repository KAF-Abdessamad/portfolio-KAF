import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Download,
    Printer,
    ChevronLeft,
    ChevronRight,
    FileText,

    Share2,
    Globe,
    ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Container from '../components/layout/Container';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CVPreview from '../sections/CV/CVPreview';
import { useCV } from '../hooks/useCV';
import Button from '../components/ui/Button';

export default function CVPage() {
    const [lang, setLang] = useState('fr');
    const { cvUrl, cvData, loading, trackDownload } = useCV(lang);

    const handlePrint = () => {
        if (!cvUrl) return;
        const printWindow = window.open(cvUrl, '_blank');
        printWindow.onload = () => {
            printWindow.print();
        };
    };

    const handleDownload = async () => {
        if (!cvUrl) return;
        await trackDownload(cvData.id);
        window.open(cvUrl, '_blank');
    };

    return (
        <div className="bg-bg-primary min-h-screen">
            <Helmet>
                <title>Curriculum Vitæ | Abdessamad KAF</title>
                <meta name="description" content="Découvrez mon parcours professionnel et mes compétences techniques." />
            </Helmet>

            <Header />

            <main className="pt-32 pb-20">
                <Container>
                    {/* Header Section */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-text-accent"
                            >
                                <FileText size={14} />
                                Professional Résumé
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-4xl md:text-5xl font-bold text-text-primary tracking-tighter"
                            >
                                Mon Parcours & <br />
                                <span className="text-text-accent">Compétences</span>
                            </motion.h1>
                        </div>

                        {/* Actions & Language Toggle */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center gap-4 p-2 bg-text-accent/5 border border-border rounded-2xl"
                        >
                            <div className="flex bg-bg-surface p-1 rounded-xl border border-border">
                                <button
                                    onClick={() => setLang('fr')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${lang === 'fr' ? 'bg-text-accent text-bg-primary' : 'text-text-muted hover:text-text-primary'}`}
                                >
                                    Français
                                </button>
                                <button
                                    onClick={() => setLang('en')}
                                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${lang === 'en' ? 'bg-text-accent text-bg-primary' : 'text-text-muted hover:text-text-primary'}`}
                                >
                                    English
                                </button>
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrint}
                                    className="p-2.5 rounded-xl bg-bg-surface hover:bg-bg-card text-text-muted hover:text-text-primary transition-all border border-border"
                                    title="Imprimer"
                                >
                                    <Printer size={20} />
                                </button>
                                <button
                                    className="p-2.5 rounded-xl bg-bg-surface hover:bg-bg-card text-text-muted hover:text-text-primary transition-all border border-border"
                                    title="Partager"
                                >
                                    <Share2 size={20} />
                                </button>
                                <Button
                                    variant="primary"
                                    className="px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg"
                                    onClick={handleDownload}
                                >
                                    <Download size={18} />
                                    Télécharger
                                </Button>
                            </div>
                        </motion.div>
                    </div>

                    {/* Preview Area */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="relative"
                    >
                        <CVPreview fileUrl={cvUrl} />

                        {/* Decorative side info (Desktop Only) */}
                        <div className="hidden xl:block absolute -right-64 top-0 w-56 space-y-6">
                            <div className="bg-text-accent/5 border border-border p-6 rounded-2xl">
                                <h4 className="text-text-primary font-bold text-sm mb-4 border-b border-border pb-2">Informations</h4>
                                <ul className="space-y-4">
                                    <li className="flex flex-col gap-1">
                                        <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Dernière MAJ</span>
                                        <span className="text-text-secondary text-sm">{cvData?.updated_at ? new Date(cvData.updated_at).toLocaleDateString() : '---'}</span>
                                    </li>
                                    <li className="flex flex-col gap-1">
                                        <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Format</span>
                                        <span className="text-text-secondary text-sm">PDF A4</span>
                                    </li>
                                    <li className="flex flex-col gap-1">
                                        <span className="text-[10px] text-text-muted uppercase tracking-widest font-mono">Downloads</span>
                                        <span className="text-text-accent text-sm font-bold">{cvData?.download_count || 0}</span>
                                    </li>
                                </ul>
                            </div>

                            <Link
                                to="/#contact"
                                className="group block bg-bg-surface border border-accent/30 p-6 rounded-2xl hover:border-accent transition-all"
                            >
                                <p className="text-xs text-text-secondary mb-2">Besoin d'un profil comme le mien ?</p>
                                <span className="text-text-primary font-bold group-hover:text-text-accent flex items-center gap-2 transition-colors">
                                    Me contacter <ChevronRight size={16} />
                                </span>
                            </Link>
                        </div>
                    </motion.div>
                </Container >
            </main >

            <Footer />
        </div >
    );
}


