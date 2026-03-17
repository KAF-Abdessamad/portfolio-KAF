import React, { useState, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import {
    CertificatesHero,
    CertificatesGrid,
    CertificatesFilter,
    CertificateModal
} from '../sections/Certificates';
import { useCertificates } from '../hooks/useCertificates';
import Container from '../components/layout/Container';
import Footer from '../components/layout/Footer';
import Header from '../components/layout/Header';

export default function CertificatesPage() {
    const { certificates, loading, error } = useCertificates();
    const [activeCategory, setActiveCategory] = useState('All');
    const [selectedCert, setSelectedCert] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Calculate counts for filter
    const categoryCounts = useMemo(() => {
        const counts = { All: certificates.length };
        certificates.forEach(cert => {
            counts[cert.category] = (counts[cert.category] || 0) + 1;
        });
        return counts;
    }, [certificates]);

    // Filter certificates
    const filteredCertificates = useMemo(() => {
        if (activeCategory === 'All') return certificates;
        return certificates.filter(cert => cert.category === activeCategory);
    }, [certificates, activeCategory]);

    const handleCardClick = (cert) => {
        setSelectedCert(cert);
        setIsModalOpen(true);
    };

    const handlePrev = () => {
        const currentIndex = filteredCertificates.findIndex(c => c.id === selectedCert.id);
        const prevIndex = (currentIndex - 1 + filteredCertificates.length) % filteredCertificates.length;
        setSelectedCert(filteredCertificates[prevIndex]);
    };

    const handleNext = () => {
        const currentIndex = filteredCertificates.findIndex(c => c.id === selectedCert.id);
        const nextIndex = (currentIndex + 1) % filteredCertificates.length;
        setSelectedCert(filteredCertificates[nextIndex]);
    };

    if (error) {
        return (
            <div className="min-h-screen bg-primary flex items-center justify-center p-6 text-center">
                <div className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">Oups ! Une erreur est survenue</h2>
                    <p className="text-slate-400">Impossible de charger les certificats pour le moment.</p>
                    <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl max-w-md mx-auto">
                        <p className="text-xs font-mono text-red-500/80">
                            {error?.message || JSON.stringify(error)}
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-6 py-2 bg-secondary text-primary font-bold rounded-lg"
                    >
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-primary min-h-screen">
            <Helmet>
                <title>Certifications | Abdessamad KAF</title>
                <meta name="description" content="Découvrez mes certifications professionnelles et mes accomplissements académiques." />
            </Helmet>

            <Header />

            <main>
                <CertificatesHero totalCount={certificates.length} />

                <Container className="pb-32">
                    <CertificatesFilter
                        activeCategory={activeCategory}
                        setCategory={setActiveCategory}
                        counts={categoryCounts}
                    />

                    <CertificatesGrid
                        certificates={filteredCertificates}
                        loading={loading}
                        onCardClick={handleCardClick}
                    />
                </Container>
            </main>

            <Footer />

            <CertificateModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                certificate={selectedCert}
                onPrev={handlePrev}
                onNext={handleNext}
            />
        </div>
    );
}
