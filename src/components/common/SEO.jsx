import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { defaultSEO } from '../../lib/seo';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function SEO({
    title,
    description,
    image,
    url,
    type = 'website'
}) {
    const { t, i18n } = useTranslation();
    const { settings, getLocalizedValue } = useSiteSettings();
    const lang = i18n.resolvedLanguage || i18n.language || 'fr';
    const isEn = lang.startsWith('en');

    const siteName = settings.profile?.fullName || defaultSEO.name;
    const siteRole = getLocalizedValue(settings.seo, 'role', lang, t('seo.role'));
    const customTitle = getLocalizedValue(settings.seo, 'title', lang, '');
    const resolvedTitle = title || customTitle || `${siteName} — ${siteRole}`;
    const resolvedDesc = description || getLocalizedValue(settings.seo, 'description', lang, t('seo.description'));
    const resolvedKeywords = getLocalizedValue(settings.seo, 'keywords', lang, t('seo.keywords'));
    const baseUrl = settings.seo?.siteUrl || defaultSEO.url;

    const seo = {
        title: resolvedTitle,
        description: resolvedDesc,
        image: image ? `${baseUrl}${image}` : `${baseUrl}${defaultSEO.image}`,
        url: url ? `${baseUrl}${url}` : baseUrl,
        type,
        locale: isEn ? 'en_US' : 'fr_FR',
    };

    const sameAs = [settings.profile?.githubUrl, settings.profile?.linkedinUrl].filter(Boolean);

    // Structured Data (JSON-LD) for Google
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": siteName,
        "jobTitle": siteRole,
        "url": baseUrl,
        "sameAs": sameAs.length > 0 ? sameAs : [
            "https://github.com/KAF-Abdessamad",
            "https://www.linkedin.com/in/kaf-abdessamad-311a38246/"
        ]
    };

    return (
        <Helmet>
            {/* Standard metadata */}
            <title>{seo.title}</title>
            <meta name="description" content={seo.description} />
            <meta name="image" content={seo.image} />
            <link rel="canonical" href={seo.url} />
            <meta name="robots" content="index, follow" />
            <meta name="author" content={siteName} />
            <meta name="keywords" content={resolvedKeywords} />

            {/* Open Graph (Facebook, LinkedIn, etc.) */}
            <meta property="og:type" content={seo.type} />
            <meta property="og:url" content={seo.url} />
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:image" content={seo.image} />
            <meta property="og:site_name" content={siteName} />
            <meta property="og:locale" content={seo.locale} />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
}
