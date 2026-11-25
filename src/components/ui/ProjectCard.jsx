import React, { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Github, ExternalLink, ArrowRight, Sparkles, ImageOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1614850523296-62c0af475430?auto=format&fit=crop&q=80&w=1000';

export function ProjectCardSkeleton() {
    return (
        <div
            aria-hidden="true"
            className="w-full bg-bg-card border border-border-def rounded-3xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[440px] animate-pulse shadow-theme-md"
        >
            <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="h-5 w-10 rounded-full bg-bg-surface" />
                        <div className="h-5 w-24 rounded-full bg-bg-surface" />
                        <div className="h-5 w-14 rounded-full bg-bg-surface" />
                    </div>
                    <div className="h-10 w-4/5 rounded-2xl bg-bg-surface" />
                    <div className="h-28 w-full rounded-2xl bg-bg-surface" />
                    <div className="flex flex-wrap gap-2 pt-2">
                        <div className="h-7 w-20 rounded-lg bg-bg-surface" />
                        <div className="h-7 w-24 rounded-lg bg-bg-surface" />
                        <div className="h-7 w-16 rounded-lg bg-bg-surface" />
                    </div>
                </div>
                <div className="pt-4 flex flex-wrap gap-3">
                    <div className="h-12 w-44 rounded-xl bg-bg-surface" />
                    <div className="h-12 w-36 rounded-xl bg-bg-surface" />
                </div>
            </div>
            <div className="lg:col-span-6 min-h-[280px] lg:min-h-full bg-bg-surface/50" />
        </div>
    );
}

export default function ProjectCard({ project, index = 0, onClick }) {
    const { t, i18n } = useTranslation();
    const shouldReduceMotion = useReducedMotion();
    const [imageError, setImageError] = useState(false);
    const isEn = (i18n.resolvedLanguage || i18n.language || 'fr').startsWith('en');

    // Data normalization
    const title = isEn ? (project.title_en || project.title) : project.title;
    const description = isEn ? (project.description_en || project.description) : project.description;
    const imageUrl = project.image_url || project.image || FALLBACK_IMAGE;
    const githubUrl = project.has_github === false ? null : (project.github_url || project.github);
    const liveUrl = project.live_url || project.demo || project.live;
    const techStack = Array.isArray(project.tech_stack || project.technologies)
        ? (project.tech_stack || project.technologies)
        : [];
    const category = project.category || 'Web';
    const categoryLabel = t(`projects.categories.${category}`, category);

    // Number formatting (01, 02, etc.)
    const formattedIndex = String(index + 1).padStart(2, '0');

    // Year determination
    const year = project.created_at
        ? new Date(project.created_at).getFullYear()
        : '2025';

    return (
        <article
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onClick?.(project);
                }
            }}
            aria-label={`${title} (${categoryLabel})`}
            className="group relative w-full rounded-3xl border border-border-def bg-bg-card shadow-theme-md transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-bg-primary"
        >
            {/* ── LEFT COLUMN : EDITORIAL & ACTIONS ────────────────── */}
            <div className="lg:col-span-6 xl:col-span-6 p-6 sm:p-8 lg:p-10 flex flex-col justify-between z-10">
                <div>
                    {/* Metadata Header: Number · Category · Year */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="font-mono text-xs sm:text-sm font-bold tracking-widest text-text-acc px-2.5 py-1 rounded-full bg-accent/10 border border-accent/20">
                            {formattedIndex}
                        </span>

                        <span className="px-3 py-1 rounded-full bg-bg-surface border border-border-def text-text-sec text-xs font-mono font-medium tracking-wide">
                            {categoryLabel}
                        </span>

                        <span className="font-mono text-xs text-text-mut ml-auto font-medium">
                            {year}
                        </span>
                    </div>

                    {/* Project Title with fluid clamp */}
                    <h3 className="fluid-subtitle font-bold text-text-pri mb-4 tracking-tight leading-[1.2] group-hover:text-text-acc transition-colors duration-200">
                        {title}
                    </h3>

                    {/* Impact / Overview Callout Box (Description existante, sans chiffres inventés) */}
                    {description && (
                        <div className="bg-bg-surface/50 border border-border-def/70 rounded-2xl p-4 sm:p-5 my-4">
                            <div className="flex items-center gap-2 mb-2 text-text-acc font-mono text-xs uppercase tracking-wider font-semibold">
                                <Sparkles size={14} aria-hidden="true" />
                                <span>{t('projects.impact_label', "Impact & Vue d'ensemble")}</span>
                            </div>
                            <p className="text-text-sec text-sm sm:text-base leading-relaxed">
                                {description}
                            </p>
                        </div>
                    )}

                    {/* Technologies Badges */}
                    {techStack.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4 mb-6">
                            {techStack.map((tech) => (
                                <span
                                    key={tech}
                                    className="px-2.5 py-1 rounded-lg bg-bg-surface border border-border-def text-text-sec text-xs font-mono font-medium"
                                >
                                    {tech}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Buttons: "Voir l'étude de cas" + "Démo / Code source" */}
                <div className="pt-4 border-t border-border-def flex flex-wrap items-center gap-3">
                    {/* Primary Button: Voir l'étude de cas */}
                    <button
                        type="button"
                        onClick={() => onClick?.(project)}
                        className="min-h-[44px] px-5 sm:px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-h text-white font-semibold text-sm inline-flex items-center gap-2 shadow-theme-md transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                    >
                        <span>{t('projects.view_case_study', "Voir l'étude de cas")}</span>
                        <ArrowRight size={16} aria-hidden="true" className="group-hover:translate-x-1 transition-transform" />
                    </button>

                    {/* Secondary Link(s): Démo / Code source */}
                    {(liveUrl || githubUrl) && (
                        <div className="flex items-center gap-2">
                            {liveUrl && (
                                <a
                                    href={liveUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={t('projects.open_demo', { title })}
                                    className="min-h-[44px] px-4 py-2.5 rounded-xl bg-bg-surface hover:bg-bg-elevated border border-border-def hover:border-accent/40 text-text-pri hover:text-text-acc font-medium text-sm inline-flex items-center gap-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                >
                                    <ExternalLink size={15} aria-hidden="true" />
                                    <span>{liveUrl && githubUrl ? t('projects.view_demo', 'Démo') : t('projects.demo_or_code', 'Démo / Code source')}</span>
                                </a>
                            )}

                            {githubUrl && (
                                <a
                                    href={githubUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    aria-label={t('projects.open_github', { title })}
                                    className="min-h-[44px] px-4 py-2.5 rounded-xl bg-bg-surface hover:bg-bg-elevated border border-border-def hover:border-accent/40 text-text-pri hover:text-text-acc font-medium text-sm inline-flex items-center gap-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                                >
                                    <Github size={15} aria-hidden="true" />
                                    <span>{liveUrl ? t('projects.source_code', 'Code') : t('projects.demo_or_code', 'Démo / Code source')}</span>
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* ── RIGHT COLUMN : IMMERSIVE VISUAL (NO FRAME, FADED EDGES) ── */}
            <div className="lg:col-span-6 xl:col-span-6 relative min-h-[300px] sm:min-h-[380px] lg:min-h-[480px] flex items-center justify-center overflow-hidden bg-bg-card">
                {imageError ? (
                    <div className="flex flex-col items-center justify-center p-8 text-text-mut text-center">
                        <ImageOff size={40} className="mb-2 opacity-50" />
                        <span className="text-xs font-mono">{t('projects.image_not_available')}</span>
                    </div>
                ) : (
                    <div className="relative w-full h-full flex items-center justify-center">
                        {/* Immersive Image with radial/linear fade into card background + smooth transform */}
                        <motion.img
                            src={imageUrl}
                            alt={title}
                            loading="lazy"
                            onError={() => setImageError(true)}
                            whileHover={shouldReduceMotion ? {} : { scale: 1.03 }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className="w-full h-full object-cover lg:object-contain object-center lg:object-right opacity-90 group-hover:opacity-100 transition-opacity duration-500 will-change-transform"
                            style={{
                                WebkitMaskImage:
                                    'radial-gradient(ellipse at 65% 50%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 82%)',
                                maskImage:
                                    'radial-gradient(ellipse at 65% 50%, rgba(0,0,0,1) 40%, rgba(0,0,0,0) 82%)',
                            }}
                        />

                        {/* Soft left gradient blend (desktop) */}
                        <div
                            className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-bg-card via-bg-card/60 to-transparent pointer-events-none hidden lg:block"
                            aria-hidden="true"
                        />

                        {/* Soft bottom/top gradient blends */}
                        <div
                            className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-bg-card to-transparent pointer-events-none"
                            aria-hidden="true"
                        />
                        <div
                            className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-bg-card to-transparent pointer-events-none"
                            aria-hidden="true"
                        />
                    </div>
                )}
            </div>
        </article>
    );
}
