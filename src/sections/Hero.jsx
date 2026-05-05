import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Linkedin, ArrowRight, Download } from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';
import { useTranslation } from 'react-i18next';
import Container from '../components/layout/Container';
import { SOCIAL_LINKS } from '../lib/constants/contact';
import profilePhoto from '../assets/images/img_portfolio.jpeg';

const SUBTITLES = ["React.js", "Node.js", "Laravel", "Docker", "Cloud"];

export default function Hero() {
    const { t } = useTranslation();
    const [subtitleIndex, setSubtitleIndex] = useState(0);
    const { displayText: titleText } = useTypewriter(t('hero.greeting'), 55, 400);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.15, delayChildren: 0.3 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.1, 0.25, 1] } }
    };

    // parseHTML-safe inline bold rendering
    const renderParagraph = (text) => {
        if (!text) return null;
        const parts = text.split(/(<strong>.*?<\/strong>)/g);
        return parts.map((part, i) => {
            const match = part.match(/^<strong>(.*?)<\/strong>$/);
            return match
                ? <strong key={i} className="text-text-pri font-semibold">{match[1]}</strong>
                : <React.Fragment key={i}>{part}</React.Fragment>;
        });
    };

    return (
        <section
            id="hero"
            className="relative w-full min-h-screen overflow-hidden bg-bg-primary flex items-center pt-20"
        >
            {/* Subtle radial glow background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-accent/5 rounded-full blur-[60px] md:blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[200px] h-[200px] md:w-[400px] md:h-[400px] bg-accent/8 rounded-full blur-[50px] md:blur-[100px]" />
            </div>

            <Container className="relative z-10 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center min-h-[80vh] py-12">

                    {/* ── Left: Text content ─────────────────────────────────── */}
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col"
                    >
                        {/* Mobile Header: Info (Badge + Title + Subtitles) */}
                        <div className="lg:hidden flex flex-col items-start mb-6">
                            {/* Available badge Mobile */}
                            <motion.div variants={itemVariants} className="mb-4">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-surface border border-border-def text-text-acc font-mono text-xs shadow-theme-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                                    </span>
                                    {t('hero.available')}
                                </span>
                            </motion.div>

                            {/* Typewriter title Mobile */}
                            <motion.h1
                                variants={itemVariants}
                                className="text-4xl sm:text-5xl font-bold text-text-pri leading-tight mb-2"
                            >
                                {titleText}
                                <span className="animate-pulse ml-1 inline-block w-[3px] h-10 bg-accent align-middle" />
                            </motion.h1>

                            {/* Animated subtitle Mobile */}
                            <motion.div variants={itemVariants} className="h-14 mb-4 overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.p
                                        key={SUBTITLES[subtitleIndex]}
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        exit={{ y: -20, opacity: 0 }}
                                        transition={{ duration: 0.35, ease: "backOut" }}
                                        className="text-base sm:text-lg text-text-sec font-mono leading-tight"
                                    >
                                        <span className="block text-sm text-text-muted mb-1">{t('hero.subtitle_prefix')}</span>
                                        <span className="text-text-acc">{SUBTITLES[subtitleIndex]}</span>
                                    </motion.p>
                                </AnimatePresence>
                            </motion.div>

                            {/* Large Photo Mobile (Natural size, no-split) */}
                            <motion.div 
                                variants={itemVariants}
                                className="w-full mb-8"
                            >
                                <div className="relative w-full rounded-[2rem] overflow-hidden border border-border-def shadow-xl">
                                    <img 
                                        src={profilePhoto} 
                                        alt="Abdessamad KAF" 
                                        className="w-full h-auto object-cover max-h-[400px]"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/20 to-transparent" />
                                </div>
                            </motion.div>
                        </div>

                        {/* Desktop Header Content (Hidden on mobile) */}
                        <div className="hidden lg:block">
                            {/* Available badge Desktop */}
                            <motion.div variants={itemVariants} className="mb-6">
                                <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-bg-surface border border-border-def text-text-acc font-mono text-xs shadow-theme-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                                    </span>
                                    {t('hero.available')}
                                </span>
                            </motion.div>

                            {/* Typewriter title Desktop */}
                            <motion.h1
                                variants={itemVariants}
                                className="text-5xl lg:text-6xl font-bold text-text-pri mb-3 leading-tight"
                            >
                                {titleText}
                                <span className="animate-pulse ml-1 inline-block w-[3px] h-10 lg:h-12 bg-accent align-middle" />
                            </motion.h1>
                        </div>

                        {/* Animated subtitle (Desktop Only) */}
                        <motion.div variants={itemVariants} className="h-16 mb-4 overflow-hidden hidden lg:block">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={SUBTITLES[subtitleIndex]}
                                    initial={{ y: 36, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -36, opacity: 0 }}
                                    transition={{ duration: 0.45, ease: "backOut" }}
                                    className="flex flex-col"
                                >
                                    <span className="text-sm text-text-muted font-mono mb-1">{t('hero.subtitle_prefix')}</span>
                                    <span className="text-xl md:text-2xl text-text-acc font-mono">{SUBTITLES[subtitleIndex]}</span>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* Description (Shared or filtered on Desktop) */}
                        <motion.p
                            variants={itemVariants}
                            className="text-text-sec text-base leading-relaxed mb-8 max-w-lg hidden lg:block"
                        >
                            {renderParagraph(t('hero.description'))}
                        </motion.p>
                        
                        {/* Description Mobile */}
                        <motion.p
                            variants={itemVariants}
                            className="text-text-sec text-base leading-relaxed mb-8 lg:hidden"
                        >
                            {renderParagraph(t('hero.description'))}
                        </motion.p>

                        {/* CTA buttons */}
                        <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-10">
                            <a
                                href="#projects"
                                className="group px-7 py-3 bg-accent hover:bg-accent-h text-text-inv rounded-lg font-medium shadow-accent transition-all duration-300 flex items-center gap-2"
                            >
                                {t('hero.view_projects')}
                                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </a>
                            <a
                                href="/cv"
                                className="px-7 py-3 bg-bg-surface hover:bg-bg-elevated border border-border-def text-text-pri rounded-lg font-medium transition-all duration-300 flex items-center gap-2"
                            >
                                <Download className="w-4 h-4" />
                                {t('hero.my_cv')}
                            </a>
                        </motion.div>

                        {/* Social links */}
                        <motion.div variants={itemVariants} className="flex items-center gap-4">
                            {SOCIAL_LINKS.map(link => {
                                const Icon = link.icon === 'github' ? Github : link.icon === 'linkedin' ? Linkedin : null;
                                if (!Icon) return null;
                                return (
                                    <a
                                        key={link.name}
                                        href={link.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="p-2 rounded-lg bg-bg-surface border border-border-def text-text-mut hover:text-text-acc hover:border-accent/50 transition-all duration-300"
                                    >
                                        <Icon className="w-5 h-5" />
                                    </a>
                                );
                            })}
                            <div className="h-px w-10 bg-border-def" />
                            <span className="text-xs font-mono text-text-mut uppercase tracking-widest">
                                {t('hero.connect')}
                            </span>
                        </motion.div>
                    </motion.div>

                    {/* ── Right: Profile photo (Desktop Only) ────────────────── */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.92, x: 40 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
                        className="hidden lg:flex justify-end"
                    >
                        <div className="relative">
                            {/* Glow ring */}
                            <div className="absolute -inset-4 rounded-full bg-accent/10 blur-2xl" />

                            {/* Decorative rotating ring */}
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                                className="absolute -inset-3 rounded-full border-2 border-dashed border-[#7C3AED] dark:border-[#00f0ff]/50"
                            />

                            {/* Photo frame */}
                            <div className="relative w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80 lg:w-[420px] lg:h-[420px] rounded-full overflow-hidden border-4 border-bg-surface shadow-2xl">
                                <img
                                    src={profilePhoto}
                                    alt="Abdessamad KAF"
                                    className="w-full h-full object-cover object-[center_25%]"
                                />
                                {/* Subtle overlay */}
                                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-bg-primary/10" />
                            </div>

                            {/* Floating badge — Tech stack */}
                            {/* <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1, duration: 0.5 }}
                                className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap px-4 py-2 bg-bg-card border border-border-def rounded-full text-xs font-mono text-text-acc shadow-theme-sm"
                            >
                                React · Laravel · Node.js
                            </motion.div> */}
                        </div>
                    </motion.div>

                </div>
            </Container>
        </section>
    );
}
