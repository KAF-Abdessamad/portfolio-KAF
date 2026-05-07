import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';

export default function LanguageSwitcher() {
    const { i18n } = useTranslation();

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'fr' ? 'en' : 'fr';
        i18n.changeLanguage(nextLang);
    };

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleLanguage}
            className="group flex items-center gap-2 px-3 h-9 rounded-lg bg-bg-surface border border-border-def hover:border-accent/40 transition-all duration-300"
            title={i18n.language === 'fr' ? 'Switch to English' : 'Passer au Français'}
        >
            <Globe className="w-4 h-4 text-text-mut group-hover:text-text-acc transition-colors" />
            <span className="text-xs font-bold font-mono text-text-sec group-hover:text-text-pri transition-colors uppercase">
                {i18n.language === 'fr' ? 'EN' : 'FR'}
            </span>
        </motion.button>
    );
}
