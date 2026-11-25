import React, { useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { GraduationCap, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Section from '../../components/layout/Section';
import Container from '../../components/layout/Container';
import SkillsMarquee from './SkillsMarquee';
import EducationTimeline from './EducationTimeline';
import ExperienceTimeline from './ExperienceTimeline';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function About() {
    const { t, i18n } = useTranslation();
    const shouldReduceMotion = useReducedMotion();
    const { settings, getLocalizedValue } = useSiteSettings();
    const lang = i18n.resolvedLanguage || i18n.language || 'fr';
    const aboutSettings = settings.home?.about;
    const [activeTab, setActiveTab] = useState('education');

    const techTitle = getLocalizedValue(aboutSettings, 'tech_title', lang, t('about.tech_title'));
    const techSubtitle = getLocalizedValue(aboutSettings, 'tech_subtitle', lang, t('about.tech_subtitle'));
    const academicTrack = getLocalizedValue(aboutSettings, 'academic_track', lang, t('about.academic_track'));
    const educationTitle = getLocalizedValue(aboutSettings, 'education_title', lang, t('about.education_title'));
    const educationAccent = getLocalizedValue(aboutSettings, 'education_accent', lang, t('about.education_accent'));
    const educationDesc = getLocalizedValue(aboutSettings, 'education_desc', lang, t('about.education_desc'));
    const careerTrack = getLocalizedValue(aboutSettings, 'career_track', lang, t('about.career_track'));
    const experienceTitle = getLocalizedValue(aboutSettings, 'experience_title', lang, t('about.experience_title'));
    const experienceAccent = getLocalizedValue(aboutSettings, 'experience_accent', lang, t('about.experience_accent'));
    const experienceDesc = getLocalizedValue(aboutSettings, 'experience_desc', lang, t('about.experience_desc'));

    return (
        <Section id="about" className="bg-bg-primary pt-32 pb-20 overflow-hidden">
            <Container>
                {/* Skills marquee with scroll trigger */}
                <div className="mb-20 sm:mb-28">
                    <motion.div
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
                        className="text-center mb-10 sm:mb-12"
                    >
                        <h3 className="fluid-subtitle font-bold text-text-pri mb-3 tracking-tight">
                            {techTitle}
                        </h3>
                        <p className="text-text-sec fluid-body max-w-xl mx-auto">
                            {techSubtitle}
                        </p>
                    </motion.div>

                    <SkillsMarquee />
                </div>

                {/* Flexible Experience / Education Section */}
                <div>
                    {/* Tabs */}
                    <div className="flex justify-center mb-12">
                        <div className="inline-flex rounded-xl bg-bg-surface p-1 border border-border-def">
                            <button
                                onClick={() => setActiveTab('education')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                    activeTab === 'education'
                                        ? 'bg-accent text-text-inv shadow-theme-sm'
                                        : 'text-text-sec hover:text-text-pri hover:bg-bg-card'
                                }`}
                            >
                                {t('about.education_tab')}
                            </button>
                            <button
                                onClick={() => setActiveTab('experience')}
                                className={`px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                    activeTab === 'experience'
                                        ? 'bg-accent text-text-inv shadow-theme-sm'
                                        : 'text-text-sec hover:text-text-pri hover:bg-bg-card'
                                }`}
                            >
                                {t('about.experience_tab')}
                            </button>
                        </div>
                    </div>

                    <div className="min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'education' ? (
                                <motion.div
                                    key="education"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="text-center max-w-3xl mx-auto mb-16">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-surface border border-border-def text-text-mut font-mono text-xs uppercase tracking-[0.2em] mb-4">
                                            <GraduationCap size={12} className="text-text-acc" />
                                            {academicTrack}
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-text-pri mb-4">
                                            {educationTitle} <span className="text-text-acc">{educationAccent}</span>
                                        </h3>
                                        <p className="text-text-sec">
                                            {educationDesc}
                                        </p>
                                    </div>
                                    <EducationTimeline />
                                </motion.div>
                            ) : (
                                <motion.div
                                    key="experience"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="text-center max-w-3xl mx-auto mb-16">
                                        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-bg-surface border border-border-def text-text-mut font-mono text-xs uppercase tracking-[0.2em] mb-4">
                                            <Briefcase size={12} className="text-text-acc" />
                                            {careerTrack}
                                        </div>
                                        <h3 className="text-3xl md:text-4xl font-bold text-text-pri mb-4">
                                            {experienceTitle} <span className="text-text-acc">{experienceAccent}</span>
                                        </h3>
                                        <p className="text-text-sec">
                                            {experienceDesc}
                                        </p>
                                    </div>
                                    <ExperienceTimeline />
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </Container>
        </Section>
    );
}
