import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Github, Linkedin, ArrowRight, Download } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTypewriter } from '../hooks/useTypewriter';
import { useTranslation } from 'react-i18next';
import Container from '../components/layout/Container';
import { SOCIAL_LINKS } from '../lib/constants/contact';
import profilePhotoFallback from '../assets/images/img_portfolio.jpeg';
import { useSiteSettings } from '../hooks/useSiteSettings';

const DEFAULT_SUBTITLES = ["React.js", "Node.js", "Laravel", "Docker", "Cloud"];

export default function Hero() {
    const { t, i18n } = useTranslation();
    const shouldReduceMotion = useReducedMotion();
    const { settings, getLocalizedValue } = useSiteSettings();
    const lang = i18n.resolvedLanguage || i18n.language || 'fr';
    const heroSettings = settings.home?.hero;

    // Scroll parallax for photo
    const { scrollY } = useScroll();
    const photoY = useTransform(scrollY, [0, 600], [0, shouldReduceMotion ? 0 : 80]);
    const photoOpacity = useTransform(scrollY, [0, 500], [1, shouldReduceMotion ? 1 : 0.4]);

    const subtitles = Array.isArray(heroSettings?.subtitles) && heroSettings.subtitles.length > 0
        ? heroSettings.subtitles
        : DEFAULT_SUBTITLES;

    const availableText = getLocalizedValue(heroSettings, 'available', lang, t('hero.available'));
    const greetingText = getLocalizedValue(heroSettings, 'greeting', lang, t('hero.greeting'));
    const subtitlePrefix = getLocalizedValue(heroSettings, 'subtitle_prefix', lang, t('hero.subtitle_prefix'));
    const descriptionText = getLocalizedValue(heroSettings, 'description', lang, t('hero.description'));
    const viewProjectsText = getLocalizedValue(heroSettings, 'view_projects', lang, t('hero.view_projects'));
    const downloadCvText = getLocalizedValue(heroSettings, 'download_cv', lang, t('hero.download_cv'));
    const connectText = getLocalizedValue(heroSettings, 'connect', lang, t('hero.connect'));
    
    // Photo source from Supabase (or fallback)
    const heroPhoto = heroSettings?.profile_image_url || profilePhotoFallback;
    const showPhoto = heroSettings?.show_photo !== false && Boolean(heroPhoto);
    const showBadge = settings.appearance?.showAvailabilityBadge !== false && heroSettings?.show_badge !== false;
    const enableGlow = settings.appearance?.enableGlowEffects !== false;
    const showSocialLinks = settings.appearance?.showSocialLinks !== false && heroSettings?.show_social !== false;
    const showActions = heroSettings?.show_actions !== false;

    const socialLinks = [
        { name: 'GitHub', url: settings.profile?.githubUrl || SOCIAL_LINKS[0].url, icon: 'github' },
        { name: 'LinkedIn', url: settings.profile?.linkedinUrl || SOCIAL_LINKS[1].url, icon: 'linkedin' },
    ].filter(l => Boolean(l.url));

    const [subtitleIndex, setSubtitleIndex] = useState(0);
    const { displayText: titleText } = useTypewriter(greetingText, 55, 250);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        setSubtitleIndex(0);
    }, [subtitles.length]);

    useEffect(() => {
        if (subtitles.length <= 1) return;
        const interval = setInterval(() => {
            setSubtitleIndex((prev) => (prev + 1) % subtitles.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [subtitles.length]);

    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.15, delayChildren: 0.2 } }
    };
    const itemVariants = {
        hidden: { opacity: 0, y: 24 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0.25, 1] } }
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
            className="relative w-full min-h-screen overflow-hidden bg-bg-primary flex items-center pt-24 pb-16 lg:py-0"
        >
            {/* ── IMMERSIVE BACKGROUND PROFILE PHOTO (FRAMELAMP, FADED EDGES + PARALLAX) ── */}
            {showPhoto && (
                <motion.div 
                    aria-hidden="true" 
                    style={{ y: photoY, opacity: photoOpacity }}
                    className="absolute inset-y-0 right-0 w-full lg:w-[65%] xl:w-[60%] pointer-events-none overflow-hidden z-0 flex items-center justify-end"
                >
                    {/* The very large profile photo smoothly dissolving into page background */}
                    <motion.img
                        initial={shouldReduceMotion ? { opacity: 0.4 } : { opacity: 0, scale: 1.05 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: shouldReduceMotion ? 0.2 : 1.2, ease: [0.25, 0.1, 0.25, 1] }}
                        src={heroPhoto}
                        alt=""
                        className="w-full h-full object-cover object-[center_20%] lg:object-[right_20%] opacity-40 dark:opacity-35 transition-opacity duration-700"
                        style={{
                            WebkitMaskImage:
                                'radial-gradient(ellipse at 75% 40%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 75%)',
                            maskImage:
                                'radial-gradient(ellipse at 75% 40%, rgba(0,0,0,1) 25%, rgba(0,0,0,0) 75%)',
                        }}
                    />

                    {/* Gradient overlay for seamless left fade into text zone */}
                    <div 
                        className="absolute inset-0 bg-gradient-to-r from-bg-primary via-bg-primary/80 to-transparent lg:w-[65%]" 
                    />
                    {/* Bottom and Top fades */}
                    <div 
                        className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent" 
                    />
                    <div 
                        className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-bg-primary to-transparent" 
                    />
                </motion.div>
            )}

            {/* Ambient radial glow lights */}
            {enableGlow && (
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-[320px] h-[320px] md:w-[600px] md:h-[600px] bg-accent/8 rounded-full blur-[80px] md:blur-[140px]" />
                    <div className="absolute bottom-1/4 right-1/3 w-[240px] h-[240px] md:w-[450px] md:h-[450px] bg-accent/10 rounded-full blur-[60px] md:blur-[110px]" />
                </div>
            )}

            {/* ── FOREGROUND CONTENT (HIGH Z-INDEX) ────────────────── */}
            <Container className="relative z-10 w-full">
                <div className="max-w-2xl lg:max-w-3xl py-12 lg:py-24">
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="flex flex-col items-start"
                    >
                        {/* Availability Badge */}
                        {showBadge && (
                            <motion.div variants={itemVariants} className="mb-6">
                                <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-bg-surface/80 backdrop-blur-xs border border-border-def text-text-acc font-mono text-xs shadow-theme-sm">
                                    <span className="relative flex h-2 w-2">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
                                        <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
                                    </span>
                                    {availableText}
                                </span>
                            </motion.div>
                        )}

                        {/* Typewriter title with fluid clamp */}
                        <motion.h1
                            variants={itemVariants}
                            className="fluid-title font-bold text-text-pri mb-4 tracking-tight drop-shadow-sm max-w-2xl"
                        >
                            {titleText}
                            <span className="animate-pulse ml-1 inline-block w-[3px] h-[0.9em] bg-accent align-middle" />
                        </motion.h1>

                        {/* Animated subtitle */}
                        <motion.div variants={itemVariants} className="h-14 sm:h-16 mb-4 overflow-hidden">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={subtitles[subtitleIndex]}
                                    initial={{ y: 28, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    exit={{ y: -28, opacity: 0 }}
                                    transition={{ duration: 0.35, ease: "backOut" }}
                                    className="flex flex-col"
                                >
                                    <span className="text-xs sm:text-sm text-text-muted font-mono mb-1">{subtitlePrefix}</span>
                                    <span className="text-xl sm:text-2xl lg:text-3xl text-text-acc font-mono font-medium">{subtitles[subtitleIndex]}</span>
                                </motion.div>
                            </AnimatePresence>
                        </motion.div>

                        {/* Description */}
                        {descriptionText && (
                            <motion.div
                                variants={itemVariants}
                                className="text-text-sec text-base sm:text-lg leading-relaxed mb-8 max-w-xl backdrop-blur-[2px]"
                            >
                                {renderParagraph(descriptionText)}
                            </motion.div>
                        )}

                        {/* CTA buttons */}
                        {showActions && (
                            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
                                <a
                                    href="#projects"
                                    className="group min-h-[44px] w-full sm:w-auto px-7 py-3 bg-accent hover:bg-accent-h text-white rounded-xl font-semibold shadow-theme-md transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                >
                                    <span>{viewProjectsText}</span>
                                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </a>
                                <Link
                                    to="/cv"
                                    className="min-h-[44px] w-full sm:w-auto px-7 py-3 bg-bg-surface/80 hover:bg-bg-elevated border border-border-def text-text-pri rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                >
                                    <Download className="w-4 h-4" />
                                    <span>{downloadCvText}</span>
                                </Link>
                            </motion.div>
                        )}

                        {/* Social links */}
                        {showSocialLinks && socialLinks.length > 0 && (
                            <motion.div variants={itemVariants} className="flex items-center gap-4 pt-2">
                                {socialLinks.map(link => {
                                    const Icon = link.icon === 'github' ? Github : link.icon === 'linkedin' ? Linkedin : null;
                                    if (!Icon) return null;
                                    return (
                                        <a
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            aria-label={link.name}
                                            className="min-h-[44px] min-w-[44px] p-2.5 rounded-xl bg-bg-surface/80 border border-border-def text-text-mut hover:text-text-acc hover:border-accent/50 transition-colors flex items-center justify-center focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                        >
                                            <Icon className="w-5 h-5" />
                                        </a>
                                    );
                                })}
                                <div className="h-px w-10 bg-border-def" />
                                <span className="text-xs font-mono text-text-mut uppercase tracking-widest font-medium">
                                    {connectText}
                                </span>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            </Container>
        </section>
    );
}
