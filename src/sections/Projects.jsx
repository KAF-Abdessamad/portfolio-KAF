import React, { useState, useRef } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'framer-motion';
import { Layers, AlertCircle, RefreshCw, FolderOpen } from 'lucide-react';
import Section from '../components/layout/Section';
import Container from '../components/layout/Container';
import ProjectCard, { ProjectCardSkeleton } from '../components/ui/ProjectCard';
import ProjectModal from '../components/ui/ProjectModal';
import { useProjects } from '../hooks/useProjects';
import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '../hooks/useSiteSettings';

function StackingProjectCard({ project, index, total, onSelectProject, shouldReduceMotion }) {
    const cardRef = useRef(null);

    // Track scroll of this card relative to the viewport
    const { scrollYProgress } = useScroll({
        target: cardRef,
        offset: ['start start', 'end start'],
    });

    const isLast = index === total - 1;
    const targetScale = isLast || shouldReduceMotion ? 1 : 0.94;
    const targetDim = isLast || shouldReduceMotion ? 0 : 0.32;

    const scale = useTransform(scrollYProgress, [0, 1], [1, targetScale]);
    const dim = useTransform(scrollYProgress, [0, 1], [0, targetDim]);

    // Sticky offset under the navbar (staggered stack effect on mobile AND desktop)
    // Mobile navbar is ~4.5rem high, desktop is ~5.5rem. We use a responsive calc.
    const stickyTop = `calc(4.5rem + ${Math.min(index, 5) * 0.75}rem)`;

    return (
        <div
            ref={cardRef}
            style={{ top: stickyTop }}
            className="w-full sticky mb-10 sm:mb-14 lg:mb-16 last:mb-0"
        >
            <motion.div
                style={{
                    scale: shouldReduceMotion ? 1 : scale,
                    transformOrigin: 'top center',
                }}
                className="w-full relative rounded-3xl"
            >
                <ProjectCard
                    project={project}
                    index={index}
                    onClick={onSelectProject}
                />

                {/* Smooth dimming overlay as the card is covered by the next one */}
                {!shouldReduceMotion && !isLast && (
                    <motion.div
                        style={{ opacity: dim }}
                        className="absolute inset-0 rounded-3xl bg-black pointer-events-none"
                        aria-hidden="true"
                    />
                )}
            </motion.div>
        </div>
    );
}

export default function Projects() {
    const { t, i18n } = useTranslation();
    const shouldReduceMotion = useReducedMotion();
    const { settings, getLocalizedValue } = useSiteSettings();
    const lang = i18n.resolvedLanguage || i18n.language || 'fr';
    const { projects, loading, error, fetchProjects } = useProjects();

    const [selectedProject, setSelectedProject] = useState(null);

    const sectionTitle = getLocalizedValue(settings.home?.projects, 'title', lang, t('projects.title'));
    const sectionDescription = getLocalizedValue(settings.home?.projects, 'description', lang, t('projects.description'));

    const titleWords = sectionTitle.split(' ');
    const firstWord = titleWords[0] || '';
    const restWords = titleWords.slice(1).join(' ');

    return (
        <Section id="projects" className="bg-bg-primary text-text-pri pt-24 pb-20 md:pb-32">
            <Container>
                {/* ── Section Header (No filters, No counters) ─────────────── */}
                <div className="max-w-3xl mb-12 lg:mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 mb-4 rounded-full bg-bg-surface border border-border-def text-text-acc text-xs font-mono uppercase tracking-[0.2em]">
                        <Layers size={14} aria-hidden="true" />
                        <span>{t('projects.badge')}</span>
                    </div>

                    <motion.h2
                        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.3 }}
                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-pri mb-4 leading-[1.15] tracking-tight"
                    >
                        {firstWord}
                        {restWords ? ' ' : ''}
                        {restWords && (
                            <span className="text-text-acc relative inline-block">
                                {restWords}
                                <span
                                    className="absolute bottom-0 left-0 w-full h-[3px] bg-accent/30 rounded-full"
                                    aria-hidden="true"
                                />
                            </span>
                        )}
                    </motion.h2>

                    <p className="text-text-sec text-base sm:text-lg leading-relaxed">
                        {sectionDescription}
                    </p>
                </div>

                {/* ── Main Content Area ────────────────────────────────────── */}
                <div className="min-h-[360px]">
                    {error ? (
                        /* Error State */
                        <div
                            role="alert"
                            className="bg-bg-card border border-red-500/30 rounded-3xl p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-theme-sm"
                        >
                            <div className="w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 flex items-center justify-center mx-auto mb-5">
                                <AlertCircle size={28} aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-bold text-text-pri mb-2">
                                {t('projects.error_title')}
                            </h3>
                            <p className="text-text-sec text-sm sm:text-base leading-relaxed mb-6">
                                {t('projects.load_error')} {error.message || t('projects.load_error_fallback')}
                            </p>
                            <button
                                type="button"
                                onClick={fetchProjects}
                                className="min-h-[44px] px-6 py-2.5 rounded-xl bg-accent hover:bg-accent-h text-white font-semibold text-sm inline-flex items-center gap-2 transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                            >
                                <RefreshCw size={16} aria-hidden="true" />
                                <span>{t('projects.retry')}</span>
                            </button>
                        </div>
                    ) : loading ? (
                        /* Loading Skeleton State */
                        <div className="space-y-8" aria-busy="true" aria-live="polite">
                            <ProjectCardSkeleton />
                            <ProjectCardSkeleton />
                        </div>
                    ) : !projects || projects.length === 0 ? (
                        /* Empty State */
                        <div className="bg-bg-card border border-border-def rounded-3xl p-10 sm:p-14 text-center max-w-xl mx-auto shadow-theme-sm">
                            <div className="w-16 h-16 rounded-2xl bg-bg-surface border border-border-def text-text-acc flex items-center justify-center mx-auto mb-5">
                                <FolderOpen size={30} aria-hidden="true" />
                            </div>
                            <h3 className="text-xl font-bold text-text-pri mb-2">
                                {t('projects.no_projects')}
                            </h3>
                            <p className="text-text-sec text-sm leading-relaxed">
                                {sectionDescription}
                            </p>
                        </div>
                    ) : (
                        /* Stacking Full-width Cards List */
                        <div className="relative">
                            {projects.map((project, index) => (
                                <StackingProjectCard
                                    key={project.id}
                                    project={project}
                                    index={index}
                                    total={projects.length}
                                    onSelectProject={setSelectedProject}
                                    shouldReduceMotion={shouldReduceMotion}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </Container>

            {/* Project Detail Modal (Étude de cas complète) */}
            <ProjectModal
                project={selectedProject}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </Section>
    );
}
