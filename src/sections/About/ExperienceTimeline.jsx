import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Award } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useExperience } from '../../hooks/useExperience';

const TimelineItem = ({ experience, index }) => {
    const { t, i18n } = useTranslation();
    const isEn = i18n.language.startsWith('en');
    const isEven = index % 2 === 0;

    // Language selection
    const title = isEn ? (experience.degree_en || experience.degree) : experience.degree;
    const school = isEn ? (experience.school_en || experience.school) : experience.school;
    const description = isEn ? (experience.description_en || experience.description) : experience.description;
    const badge = isEn ? (experience.badge_en || experience.badge) : experience.badge;
    const highlights = isEn ? (Array.isArray(experience.highlights_en) && experience.highlights_en.length > 0 ? experience.highlights_en : experience.highlights) : experience.highlights;
    const highlightsToRender = Array.isArray(highlights) ? highlights : [];

    return (
        <div className={`relative flex flex-col md:flex-row items-center mb-16 last:mb-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
            {/* Date Desktop Side */}
            <div className="hidden md:flex w-full md:w-1/2 justify-center px-8">
                <motion.div
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-right"
                >
                    <span className="text-text-acc font-mono tracking-widest text-lg bg-bg-surface px-4 py-2 rounded-lg border border-border-def">
                        {experience.period}
                    </span>
                </motion.div>
            </div>

            {/* Central Connector/Dot */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-border-def -translate-x-1/2 z-0">
                <div className="sticky top-1/2 w-4 h-4 rounded-full bg-accent border-4 border-bg-primary shadow-accent z-10 -translate-x-1/2 -ml-[1px]" />
            </div>

            {/* Content Card */}
            <div className="w-full md:w-1/2 pl-16 md:px-12 z-10">
                <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-bg-card border border-border-def p-8 rounded-2xl shadow-theme-sm hover:border-accent/30 transition-colors group"
                >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-5">
                        <div>
                            {badge && (
                                <span className="inline-block mb-2 px-3 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-accent/10 text-text-acc rounded-full border border-accent/20">
                                    {badge}
                                </span>
                            )}
                            <h3 className="text-xl font-bold text-text-pri group-hover:text-text-acc transition-colors">
                                {title}
                            </h3>
                            <p className="text-base text-text-sec font-medium mt-1">{school}</p>
                        </div>
                        {/* Mobile period */}
                        <span className="md:hidden text-sm font-mono text-text-acc bg-bg-surface px-3 py-1 rounded-lg border border-border-def shrink-0">
                            {experience.period}
                        </span>
                    </div>

                    {experience.location && (
                        <div className="flex items-center gap-4 text-sm text-text-mut mb-5">
                            <div className="flex items-center gap-1">
                                <MapPin size={14} className="text-text-acc" />
                                {experience.location}
                            </div>
                            <div className="flex items-center gap-1">
                                <Briefcase size={14} className="text-text-acc" />
                                {t('about.internship')}
                            </div>
                        </div>
                    )}

                    {description && (
                        <p className="text-text-sec leading-relaxed mb-6">
                            {description}
                        </p>
                    )}

                    {highlightsToRender.length > 0 && (
                        <div className="space-y-3">
                            <h4 className="text-sm font-mono text-text-acc uppercase tracking-widest flex items-center gap-2">
                                <Award size={14} />
                                {t('about.tech_skills')}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {highlightsToRender.map((h, i) => (
                                    <span key={i} className="text-[10px] font-mono text-text-mut bg-bg-surface px-2.5 py-1 rounded border border-border-def uppercase tracking-wide">
                                        {h}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </motion.div>
            </div>
        </div>
    );
};

const SkeletonItem = ({ index }) => {
    const isEven = index % 2 === 0;
    return (
        <div className={`relative flex flex-col md:flex-row items-center mb-16 last:mb-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
            <div className="hidden md:flex w-full md:w-1/2 justify-center px-8">
                <div className="h-10 w-32 bg-bg-surface rounded-lg animate-pulse" />
            </div>
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-border-def -translate-x-1/2 z-0">
                <div className="sticky top-1/2 w-4 h-4 rounded-full bg-bg-surface -translate-x-1/2 -ml-[1px]" />
            </div>
            <div className="w-full md:w-1/2 pl-16 md:px-12 z-10">
                <div className="bg-bg-card border border-border-def p-8 rounded-2xl animate-pulse space-y-4">
                    <div className="h-5 bg-bg-surface rounded w-3/4" />
                    <div className="h-4 bg-bg-surface rounded w-1/2" />
                    <div className="h-4 bg-bg-surface rounded w-full" />
                    <div className="h-4 bg-bg-surface rounded w-5/6" />
                </div>
            </div>
        </div>
    );
};

export default function ExperienceTimeline() {
    const { getStages, loading } = useExperience();
    const stages = getStages();

    return (
        <div className="relative pt-10">
            {loading
                ? [0, 1].map(i => <SkeletonItem key={i} index={i} />)
                : stages.map((exp, index) => (
                    <TimelineItem key={exp.id ?? index} experience={exp} index={index} />
                ))
            }
        </div>
    );
}
