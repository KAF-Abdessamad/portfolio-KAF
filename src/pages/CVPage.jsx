import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Download,
    Printer,
    FileText
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Container from '../components/layout/Container';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import CVPreview from '../sections/CV/CVPreview';
import { useCV } from '../hooks/useCV';
import Button from '../components/ui/Button';
import SEO from '../components/common/SEO';

export default function CVPage() {
    const { t, i18n } = useTranslation();
    const currentSiteLang = (i18n.resolvedLanguage || i18n.language || 'fr').startsWith('en') ? 'en' : 'fr';
    const [cvLang, setCvLang] = useState(currentSiteLang);

    // Sync CV language when site language changes
    useEffect(() => {
        setCvLang(currentSiteLang);
    }, [currentSiteLang]);

    const { cvUrl, cvData, trackDownload } = useCV(cvLang);

    const handlePrint = () => {
        if (!cvUrl) return;
        const printWindow = window.open(cvUrl, '_blank');
        if (printWindow) {
            printWindow.onload = () => {
                printWindow.print();
            };
        }
    };

    const handleDownload = async () => {
        if (!cvUrl) return;
        await trackDownload(cvData?.id);
        window.open(cvUrl, '_blank');
    };

    return (
        <div className="bg-bg-primary min-h-screen">
            <SEO
                title={t('cv.meta_title')}
                description={t('cv.meta_description')}
                url="/cv"
            />

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
                                {t('cv.subtitle')}
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary tracking-tighter"
                            >
                                {t('cv.title')} <br className="hidden sm:block" />
                                <span className="text-text-accent">{t('cv.accent')}</span>
                            </motion.h1>
                        </div>

                        {/* Actions */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.2 }}
                            className="flex flex-wrap items-center gap-3"
                        >
                            {/* CV Language Switcher */}
                            <div className="flex bg-bg-surface p-1 rounded-xl border border-border-def">
                                <button
                                    onClick={() => setCvLang('fr')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                                        cvLang === 'fr'
                                            ? 'bg-accent text-text-inv'
                                            : 'text-text-sec hover:text-text-pri'
                                    }`}
                                >
                                    FR
                                </button>
                                <button
                                    onClick={() => setCvLang('en')}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                                        cvLang === 'en'
                                            ? 'bg-accent text-text-inv'
                                            : 'text-text-sec hover:text-text-pri'
                                    }`}
                                >
                                    EN
                                </button>
                            </div>

                            <button
                                onClick={handlePrint}
                                disabled={!cvUrl}
                                className="p-2.5 rounded-xl bg-bg-surface hover:bg-bg-card text-text-muted hover:text-text-primary transition-all border border-border-def disabled:opacity-50"
                                title={t('cv.print')}
                            >
                                <Printer size={20} />
                            </button>
                            <Button
                                variant="primary"
                                className="px-6 py-2.5 rounded-xl flex items-center gap-2 shadow-lg"
                                onClick={handleDownload}
                                disabled={!cvUrl}
                            >
                                <Download size={18} />
                                {t('cv.download')}
                            </Button>
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
                    </motion.div>
                </Container>
            </main>

            <Footer />
        </div>
    );
}
