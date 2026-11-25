import React, { useState, useEffect, useCallback } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
    Github,
    ExternalLink,
    CheckCircle2,
    ChevronLeft,
    ChevronRight,
    ImageOff,
    Star
} from 'lucide-react';
import Modal from './Modal';
import Button from './Button';
import { useTranslation } from 'react-i18next';

export default function ProjectModal({ project, isOpen, onClose }) {
    const { t, i18n } = useTranslation();
    const shouldReduceMotion = useReducedMotion();
    const [imageError, setImageError] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const isEn = (i18n.resolvedLanguage || i18n.language || 'fr').startsWith('en');

    const coverImage = project?.image_url || project?.image;
    const projectImages = Array.isArray(project?.project_images) ? project.project_images : [];
    const gallery = [coverImage, ...projectImages].filter(Boolean);

    // Reset carousel state whenever a different project is opened
    useEffect(() => {
        setCurrentImageIndex(0);
        setImageError(false);
    }, [project?.id, isOpen]);

    const nextImage = useCallback((e) => {
        if (e) e.stopPropagation();
        if (gallery.length <= 1) return;
        setImageError(false);
        setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
    }, [gallery.length]);

    const prevImage = useCallback((e) => {
        if (e) e.stopPropagation();
        if (gallery.length <= 1) return;
        setImageError(false);
        setCurrentImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
    }, [gallery.length]);

    // Keyboard navigation: ArrowLeft / ArrowRight for gallery
    useEffect(() => {
        if (!isOpen || gallery.length <= 1) return;
        const handleKeyDown = (e) => {
            const tag = e.target?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA') return;
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                nextImage();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                prevImage();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, gallery.length, nextImage, prevImage]);

    if (!project) return null;

    const title = isEn ? (project.title_en || project.title) : project.title;
    const rawDescription = isEn
        ? (project.long_description_en || project.long_description)
        : project.long_description;
    const shortDescription = isEn
        ? (project.description_en || project.description)
        : project.description;
    const description = rawDescription || shortDescription;

    const githubUrl = project.has_github === false ? null : (project.github_url || project.github);
    const liveUrl = project.live_url || project.demo || project.live;
    const techStack = Array.isArray(project.tech_stack || project.technologies)
        ? (project.tech_stack || project.technologies)
        : [];
    const challenges = Array.isArray(project.challenges) ? project.challenges : [];
    const categoryLabel = project.category
        ? t(`projects.categories.${project.category}`, project.category)
        : '';

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            closeLabel={t('projects.close_modal')}
        >
            <div className="space-y-8">
                {/* Metadata Badges */}
                {(categoryLabel || project.featured) && (
                    <div className="flex flex-wrap items-center gap-2.5">
                        {categoryLabel && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-bg-surface text-text-pri border border-border-def">
                                {categoryLabel}
                            </span>
                        )}
                        {project.featured && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-accent text-white">
                                <Star size={12} fill="currentColor" aria-hidden="true" />
                                <span>{t('projects.featured')}</span>
                            </span>
                        )}
                        {gallery.length > 1 && (
                            <span className="ml-auto text-xs font-mono text-text-mut">
                                {currentImageIndex + 1} / {gallery.length}
                            </span>
                        )}
                    </div>
                )}

                {/* Gallery Carousel */}
                <div
                    className="relative rounded-2xl bg-bg-surface border border-border-def shadow-theme-sm overflow-hidden"
                    aria-label={t('projects.gallery_title')}
                >
                    <div className="max-h-[60vh] overflow-y-auto custom-scrollbar flex items-center justify-center bg-bg-primary/50">
                        {gallery.length > 0 && !imageError ? (
                            <motion.img
                                key={currentImageIndex}
                                initial={shouldReduceMotion ? false : { opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: shouldReduceMotion ? 0 : 0.25 }}
                                src={gallery[currentImageIndex]}
                                alt={`${title} - ${currentImageIndex + 1}`}
                                onError={() => setImageError(true)}
                                className="w-full h-auto max-h-[60vh] object-contain"
                            />
                        ) : (
                            <div className="w-full h-[280px] sm:h-[360px] flex flex-col items-center justify-center text-text-sec bg-bg-surface">
                                <ImageOff size={56} className="mb-3 text-text-mut" aria-hidden="true" />
                                <span className="text-sm font-mono uppercase tracking-widest text-text-sec">
                                    {t('projects.preview_not_available')}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Accessible Prev / Next Buttons */}
                    {gallery.length > 1 && (
                        <>
                            <button
                                type="button"
                                onClick={prevImage}
                                aria-label={t('projects.prev_image')}
                                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors duration-200 border border-white/15 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            >
                                <ChevronLeft size={22} aria-hidden="true" />
                            </button>
                            <button
                                type="button"
                                onClick={nextImage}
                                aria-label={t('projects.next_image')}
                                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 inline-flex items-center justify-center bg-black/70 hover:bg-black/90 rounded-full text-white transition-colors duration-200 border border-white/15 z-10 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            >
                                <ChevronRight size={22} aria-hidden="true" />
                            </button>

                            {/* Dot Indicators */}
                            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md z-10">
                                {gallery.map((_, idx) => (
                                    <button
                                        key={idx}
                                        type="button"
                                        aria-label={`${t('projects.gallery_title')} ${idx + 1}`}
                                        aria-current={idx === currentImageIndex ? 'true' : undefined}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setImageError(false);
                                            setCurrentImageIndex(idx);
                                        }}
                                        className={`h-2 rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-white ${
                                            idx === currentImageIndex ? 'bg-white w-6' : 'bg-white/45 hover:bg-white/75 w-2'
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6">
                        {description && (
                            <div>
                                <h4 className="text-text-acc font-mono text-xs uppercase tracking-widest mb-3 font-semibold">
                                    {t('projects.description_title')}
                                </h4>
                                <p className="text-text-sec leading-relaxed text-base whitespace-pre-wrap">
                                    {description}
                                </p>
                            </div>
                        )}

                        {challenges.length > 0 && (
                            <div>
                                <h4 className="text-text-acc font-mono text-xs uppercase tracking-widest mb-4 font-semibold">
                                    {t('projects.technical_challenges')}
                                </h4>
                                <ul className="space-y-3">
                                    {challenges.map((challenge, i) => (
                                        <li key={i} className="flex items-start gap-3 text-text-sec text-sm sm:text-base">
                                            <CheckCircle2 size={18} className="text-text-acc mt-0.5 shrink-0" aria-hidden="true" />
                                            <span>{challenge}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        {techStack.length > 0 && (
                            <div>
                                <h4 className="text-text-acc font-mono text-xs uppercase tracking-widest mb-4 font-semibold">
                                    {t('projects.technologies')}
                                </h4>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.map((tech) => (
                                        <span
                                            key={tech}
                                            className="px-3 py-1.5 rounded-xl bg-bg-surface border border-border-def text-xs font-mono text-text-sec"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(liveUrl || githubUrl) && (
                            <div className="pt-6 border-t border-border-def">
                                <h4 className="text-text-acc font-mono text-xs uppercase tracking-widest mb-4 font-semibold">
                                    {t('projects.links')}
                                </h4>
                                <div className="flex flex-col gap-3">
                                    {liveUrl && (
                                        <Button
                                            type="button"
                                            onClick={() => window.open(liveUrl, '_blank', 'noopener,noreferrer')}
                                            className="w-full min-h-[44px] justify-between group py-3 px-5 !text-white"
                                        >
                                            <span className="text-sm font-semibold">{t('projects.view_demo')}</span>
                                            <ExternalLink size={18} className="group-hover:translate-x-0.5 transition-transform" aria-hidden="true" />
                                        </Button>
                                    )}
                                    {githubUrl && (
                                        <Button
                                            type="button"
                                            variant="secondary"
                                            onClick={() => window.open(githubUrl, '_blank', 'noopener,noreferrer')}
                                            className="w-full min-h-[44px] justify-between group py-3 px-5"
                                        >
                                            <span className="text-sm font-semibold">{t('projects.source_code')}</span>
                                            <Github size={18} className="group-hover:scale-105 transition-transform" aria-hidden="true" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}
