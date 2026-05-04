import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GraduationCap, Briefcase } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Section from '../../components/layout/Section';
import Container from '../../components/layout/Container';
import SkillsMarquee from './SkillsMarquee';
import EducationTimeline from './EducationTimeline';
import ExperienceTimeline from './ExperienceTimeline';

export default function About() {
    const { t } = useTranslation();
    const [activeTab, setActiveTab] = useState('education');

    return (
        <Section id="about" className="bg-bg-primary pt-32 pb-20 overflow-hidden">
            <Container>
                {/* Skills marquee */}
                <div className="mb-28">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-12"
                    >
                        <h3 className="text-3xl md:text-4xl font-semibold text-[#1e293b] dark:text-gray-200 mb-3 tracking-tight">
                            {t('about.tech_title')}
                        </h3>
                        <p className="text-[#64748b] dark:text-gray-400 text-base max-w-xl mx-auto">
                            {t('about.tech_subtitle')}
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
                                            {t('about.academic_track')}
                                        </div>
                                         <h3 className="text-3xl md:text-4xl font-bold text-text-pri mb-4">
                                            {t('about.education_title')} <span className="text-text-acc">{t('about.education_accent')}</span>
                                        </h3>
                                        <p className="text-text-sec">
                                            {t('about.education_desc')}
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
                                            {t('about.career_track')}
                                        </div>
                                         <h3 className="text-3xl md:text-4xl font-bold text-text-pri mb-4">
                                            {t('about.experience_title')} <span className="text-text-acc">{t('about.experience_accent')}</span>
                                        </h3>
                                        <p className="text-text-sec">
                                            {t('about.experience_desc')}
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
