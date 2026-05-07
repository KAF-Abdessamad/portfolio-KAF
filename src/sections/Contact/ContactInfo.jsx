import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { SOCIAL_LINKS, CONTACT_INFO } from '../../lib/constants/contact';

const ContactInfo = () => {
    const { t } = useTranslation();
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'github': return <Github size={24} />;
            case 'linkedin': return <Linkedin size={24} />;
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col justify-between p-8 bg-bg-card rounded-3xl border border-border-def shadow-lg relative overflow-hidden">

            {/* Decorative background element */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-text-accent/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
                <h3 className="text-3xl font-bold text-text-pri mb-2 tracking-tight">{t('contact.info_title')}</h3>
                <p className="text-text-sec mb-10 text-lg leading-relaxed">
                    {t('contact.info_subtitle')}
                </p>

                <div className="space-y-6">
                    <div className="flex items-center space-x-4 group">
                        <div className="w-12 h-12 shrink-0 rounded-xl bg-bg-surface border border-border-def flex items-center justify-center text-text-accent group-hover:scale-110 group-hover:border-accent group-hover:shadow-accent transition-all duration-300">
                            <Mail size={20} />
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-mono text-text-mut uppercase tracking-widest mb-1">{t('contact.email_label')}</p>
                            <a href={`mailto:${CONTACT_INFO.email}`} className="text-text-sec hover:text-text-pri transition-colors text-base break-all">
                                {CONTACT_INFO.email}
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 group">
                        <div className="w-12 h-12 shrink-0 rounded-xl bg-bg-surface border border-border-def flex items-center justify-center text-text-accent group-hover:scale-110 group-hover:border-accent group-hover:shadow-accent transition-all duration-300">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-mono text-text-mut uppercase tracking-widest mb-1">{t('contact.phone_label')}</p>
                            <p className="text-text-sec text-lg">{CONTACT_INFO.phone}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 group">
                        <div className="w-12 h-12 shrink-0 rounded-xl bg-bg-surface border border-border-def flex items-center justify-center text-text-accent group-hover:scale-110 group-hover:border-accent group-hover:shadow-accent transition-all duration-300">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-mono text-text-mut uppercase tracking-widest mb-1">{t('contact.location_label')}</p>
                            <p className="text-text-sec text-lg">{CONTACT_INFO.location}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-border relative z-10">
                <p className="text-sm font-mono text-text-mut uppercase tracking-widest mb-6">{t('contact.social_label')}</p>
                <div className="flex space-x-4">
                    {SOCIAL_LINKS.map((link) => (
                        <motion.a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ y: -5, scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-12 rounded-xl bg-bg-surface flex items-center justify-center text-text-mut hover:text-text-pri border border-border-def hover:border-accent hover:shadow-accent transition-colors"
                        >
                            {getIcon(link.icon)}
                        </motion.a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;


