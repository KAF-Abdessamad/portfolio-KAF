import React from 'react';
import { Helmet } from 'react-helmet-async';
import { defaultSEO } from '../../lib/seo';

export default function SEO({
    title,
    description,
    image,
    url,
    type = 'website'
}) {
    const seo = {
        title: title || `${defaultSEO.name} — ${defaultSEO.role}`,
        description: description || defaultSEO.description,
        image: image ? `${defaultSEO.url}${image}` : `${defaultSEO.url}${defaultSEO.image}`,
        url: url ? `${defaultSEO.url}${url}` : defaultSEO.url,
        type,
    };

    // Structured Data (JSON-LD) for Google
    const structuredData = {
        "@context": "https://schema.org",
        "@type": "Person",
        "name": defaultSEO.name,
        "jobTitle": defaultSEO.role,
        "url": defaultSEO.url,
        "sameAs": [
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
            <meta name="author" content={defaultSEO.name} />
            <meta name="keywords" content="Ingénieur, Full Stack, React, Three.js, Développeur Web, Portfolio, Abdessamad KAF" />

            {/* Open Graph (Facebook, LinkedIn, etc.) */}
            <meta property="og:type" content={seo.type} />
            <meta property="og:url" content={seo.url} />
            <meta property="og:title" content={seo.title} />
            <meta property="og:description" content={seo.description} />
            <meta property="og:image" content={seo.image} />
            <meta property="og:site_name" content={defaultSEO.name} />
            <meta property="og:locale" content={defaultSEO.locale} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:url" content={seo.url} />
            <meta name="twitter:title" content={seo.title} />
            <meta name="twitter:description" content={seo.description} />
            <meta name="twitter:image" content={seo.image} />

            {/* JSON-LD Structured Data */}
            <script type="application/ld+json">
                {JSON.stringify(structuredData)}
            </script>
        </Helmet>
    );
}
