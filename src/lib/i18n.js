import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enTranslation from '../translations/en.json';
import frTranslation from '../translations/fr.json';

const resources = {
    en: {
        translation: enTranslation,
    },
    fr: {
        translation: frTranslation,
    },
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        supportedLngs: ['fr', 'en'],
        nonExplicitSupportedLngs: true,
        load: 'languageOnly',
        fallbackLng: 'fr',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        detection: {
            order: ['localStorage', 'cookie', 'htmlTag', 'path', 'subdomain'],
            caches: ['localStorage'],
        },
    });

if (typeof document !== 'undefined') {
    const syncHtmlLang = (lng) => {
        document.documentElement.lang = (lng || 'fr').startsWith('en') ? 'en' : 'fr';
    };
    syncHtmlLang(i18n.resolvedLanguage || i18n.language);
    i18n.on('languageChanged', syncHtmlLang);
}

export default i18n;
