import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useExperience } from '../../hooks/useExperience';

const TimelineCard = ({ edu, index }) => {
    const { i18n } = useTranslation();
    const isEn = i18n.language.startsWith('en');
    const isEven = index % 2 === 0;

    // Language selection
    const degree = isEn ? (edu.degree_en || edu.degree) : edu.degree;
    const school = isEn ? (edu.school_en || edu.school) : edu.school;
    const description = isEn ? (edu.description_en || edu.description) : edu.description;
    const badge = isEn ? (edu.badge_en || edu.badge) : edu.badge;
    const highlights = isEn ? (Array.isArray(edu.highlights_en) && edu.highlights_en.length > 0 ? edu.highlights_en : edu.highlights) : edu.highlights;
    const highlightsToRender = Array.isArray(highlights) ? highlights : [];

    return (
        <div className="relative flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-0 mb-16 last:mb-0">
            {/* Left side */}
            <div className={`flex ${isEven ? 'md:justify-end md:pr-12' : 'md:order-2 md:justify-start md:pl-12'}`}>
                <motion.div
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                    className="bg-bg-card border border-border-def rounded-2xl p-7 w-full max-w-md shadow-theme-sm hover:border-accent/30 transition-colors group"
                >
                    {/* Badge */}
                    {badge && (
                        <span className="inline-block px-3 py-1 text-[10px] font-mono uppercase tracking-widest bg-accent/10 text-text-acc rounded-full border border-accent/20 mb-4">
                            {badge}
                        </span>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-3">
                        <div>
                            <h3 className="text-lg font-bold text-text-pri mb-1 leading-snug group-hover:text-text-acc transition-colors">
                                {degree}
                            </h3>
                            <p className="text-text-sec text-sm font-medium">{school}</p>
                        </div>
                        {/* Mobile period */}
                        <span className="md:hidden self-start text-[10px] font-mono text-text-acc bg-bg-surface px-2.5 py-1 rounded-lg border border-border-def whitespace-nowrap">
                            {edu.period}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-text-mut mb-4">
                        {edu.location && (
                            <span className="flex items-center gap-1">
                                <MapPin size={12} className="text-text-acc" />
                                {edu.location}
                            </span>
                        )}
                    </div>

                    {description && (
                        <p className="text-text-sec text-sm leading-relaxed mb-5">{description}</p>
                    )}

                    {highlightsToRender.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {highlightsToRender.map((h, i) => (
                                <span key={i} className="text-[10px] font-mono text-text-mut bg-bg-surface px-2.5 py-1 rounded border border-border-def uppercase tracking-wide">
                                    {h}
                                </span>
                            ))}
                        </div>
                    )}
                </motion.div>
            </div>

            {/* Central line + dot */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-border-def -translate-x-1/2">
                <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 300 }}
                    className="sticky top-1/3 w-5 h-5 rounded-full bg-accent border-4 border-bg-primary shadow-accent -translate-x-[calc(50%-1px)] flex items-center justify-center"
                >
                    <GraduationCap size={10} className="text-text-inv" />
                </motion.div>
            </div>

            {/* Right side — period label */}
            <div className={`hidden md:flex items-center ${isEven ? 'md:order-2 md:pl-12' : 'md:pr-12 md:justify-end'}`}>
                <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.1 }}
                    className="text-text-acc font-mono text-lg bg-bg-surface px-5 py-2.5 rounded-xl border border-border-def shadow-theme-sm"
                >
                    {edu.period}
                </motion.div>
            </div>
        </div>
    );
};

const SkeletonCard = ({ index }) => {
    const isEven = index % 2 === 0;
    return (
        <div className="relative flex flex-col md:grid md:grid-cols-2 gap-8 md:gap-0 mb-16 last:mb-0">
            <div className={`flex ${isEven ? 'md:justify-end md:pr-12' : 'md:order-2 md:justify-start md:pl-12'}`}>
                <div className="bg-bg-card border border-border-def rounded-2xl p-7 w-full max-w-md animate-pulse space-y-3">
                    <div className="h-5 bg-bg-surface rounded-full w-16" />
                    <div className="h-5 bg-bg-surface rounded w-3/4" />
                    <div className="h-4 bg-bg-surface rounded w-full" />
                    <div className="h-4 bg-bg-surface rounded w-5/6" />
                </div>
            </div>
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] bg-border-def -translate-x-1/2">
                <div className="sticky top-1/3 w-5 h-5 rounded-full bg-bg-surface -translate-x-[calc(50%-1px)]" />
            </div>
        </div>
    );
};

export default function EducationTimeline() {
    const { getFormations, loading } = useExperience();
    const experiences = getFormations();

    return (
        <div className="relative pt-10">
            {loading
                ? [0, 1, 2].map(i => <SkeletonCard key={i} index={i} />)
                : experiences.map((edu, index) => (
                    <TimelineCard key={edu.id ?? index} edu={edu} index={index} />
                ))
            }
        </div>
    );
}
