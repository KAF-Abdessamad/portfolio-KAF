import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Container from '../../components/layout/Container';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function Contact() {
    const { t, i18n } = useTranslation();
    const shouldReduceMotion = useReducedMotion();
    const { settings, getLocalizedValue } = useSiteSettings();
    const lang = i18n.resolvedLanguage || i18n.language || 'fr';
    const contactSettings = settings.home?.contact;

    const badge = getLocalizedValue(contactSettings, 'badge', lang, t('contact.badge'));
    const title = getLocalizedValue(contactSettings, 'title', lang, t('contact.title'));
    const accent = getLocalizedValue(contactSettings, 'accent', lang, t('contact.accent'));
    const description = getLocalizedValue(contactSettings, 'description', lang, t('contact.description'));

    return (
        <section id="contact" className="relative py-20 sm:py-28 bg-bg-primary overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-1/2 left-0 w-1/3 h-[500px] bg-accent/5 blur-[120px] -translate-y-1/2 rounded-full pointer-events-none" />
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />

            <Container>
                <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
                    <motion.div
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.4 }}
                        className="inline-flex items-center space-x-2 px-3.5 py-1.5 mb-4 rounded-full bg-accent/10 border border-accent/20 text-text-acc text-xs font-mono uppercase tracking-[0.2em]"
                    >
                        {badge}
                    </motion.div>
                    <motion.h2
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: 0.1 }}
                        className="fluid-title font-bold text-text-pri mb-4 tracking-tight"
                    >
                        {title} <span className="text-transparent bg-clip-text bg-gradient-to-r from-text-acc to-indigo-400">{accent}</span>
                    </motion.h2>
                    <motion.p
                        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: 0.2 }}
                        className="text-text-sec fluid-body leading-relaxed max-w-2xl mx-auto"
                    >
                        {description}
                    </motion.p>
                </div>

                <div className="relative max-w-6xl mx-auto lg:glass-card">
                    {/* Subtle neon border glow ring */}
                    <div className="absolute inset-0 border border-border-def rounded-2xl pointer-events-none shadow-theme-md" />

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-0 min-h-[550px] rounded-2xl overflow-hidden">
                        {/* Left side: Info */}
                        <motion.div
                            initial={shouldReduceMotion ? { opacity: 1 } : { x: -30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut" }}
                            className="lg:col-span-2"
                        >
                            <ContactInfo />
                        </motion.div>

                        {/* Right side: Form */}
                        <motion.div
                            initial={shouldReduceMotion ? { opacity: 1 } : { x: 30, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true, margin: "-40px" }}
                            transition={{ duration: shouldReduceMotion ? 0 : 0.6, ease: "easeOut", delay: shouldReduceMotion ? 0 : 0.15 }}
                            className="lg:col-span-3 bg-bg-surface"
                        >
                            <ContactForm />
                        </motion.div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
