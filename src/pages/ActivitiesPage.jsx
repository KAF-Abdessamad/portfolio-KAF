import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Calendar,
    MapPin,
    Users,
    Trophy,
    Heart,
    ChevronLeft,
    ChevronRight,
    X,
    Sparkles,
    Clock
} from 'lucide-react';
import Container from '../components/layout/Container';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import { useActivities } from '../hooks/useActivities';

const categoryIcons = {
    'Club': Users,
    'Competition': Trophy,
    'Event': Sparkles,
    'Volunteering': Heart,
    'default': Users
};

const categoryColors = {
    'Club': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    'Competition': 'bg-amber-500/10 text-amber-500 border-amber-500/20',
    'Event': 'bg-purple-500/10 text-purple-500 border-purple-500/20',
    'Volunteering': 'bg-rose-500/10 text-rose-500 border-rose-500/20',
    'default': 'bg-text-accent/10 text-text-accent border-text-accent/20'
};

export default function ActivitiesPage() {
    const { activities, loading } = useActivities();
    const [selectedActivity, setSelectedActivity] = useState(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('fr-FR', { month: 'short', year: 'numeric' });
    };

    const formatDateRange = (start, end) => {
        if (!start && !end) return '';
        if (start && !end) return formatDate(start);
        if (!start && end) return formatDate(end);
        if (start === end) return formatDate(start);
        return `${formatDate(start)} - ${formatDate(end)}`;
    };

    const nextImage = () => {
        if (!selectedActivity) return;
        setCurrentImageIndex((prev) =>
            (prev + 1) % selectedActivity.images.length
        );
    };

    const prevImage = () => {
        if (!selectedActivity) return;
        setCurrentImageIndex((prev) =>
            prev === 0 ? selectedActivity.images.length - 1 : prev - 1
        );
    };

    const openModal = (activity) => {
        setSelectedActivity(activity);
        setCurrentImageIndex(0);
    };

    const closeModal = () => {
        setSelectedActivity(null);
    };

    return (
        <div className="bg-bg-primary min-h-screen">
            <Helmet>
                <title>Activités Parascolaires | Abdessamad KAF</title>
                <meta name="description" content="Découvrez mes activités parascolaires, clubs, compétitions et événements." />
            </Helmet>

            <Header />

            <main className="pt-32 pb-20">
                <Container>
                    {/* Header */}
                    <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
                        <div className="space-y-4">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.3em] text-text-accent"
                            >
                                <Sparkles size={14} />
                                Beyond the Classroom
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="text-3xl sm:text-4xl md:text-5xl font-bold text-text-primary tracking-tighter"
                            >
                                Activités <br className="hidden sm:block" />
                                <span className="text-text-accent">Parascolaires</span>
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="text-text-secondary max-w-xl text-sm sm:text-base"
                            >
                                Mes engagements en dehors des cours : clubs, compétitions, événements et bénévolat.
                            </motion.p>
                        </div>
                    </div>

                    {/* Activities Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {loading ? (
                                // Loading skeletons
                                [...Array(6)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="bg-bg-card border border-border rounded-2xl p-6 h-80 animate-pulse"
                                    />
                                ))
                            ) : activities.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="col-span-full text-center py-20"
                                >
                                    <p className="text-text-muted">Aucune activité pour le moment.</p>
                                </motion.div>
                            ) : (
                                activities.map((activity, index) => {
                                    const CategoryIcon = categoryIcons[activity.category] || categoryIcons.default;
                                    const categoryColor = categoryColors[activity.category] || categoryColors.default;

                                    return (
                                        <motion.div
                                            key={activity.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            whileHover={{ y: -5 }}
                                            onClick={() => openModal(activity)}
                                            className="group bg-bg-card border border-border rounded-2xl overflow-hidden cursor-pointer hover:border-text-accent/30 transition-all"
                                        >
                                            {/* Image */}
                                            <div className="relative h-48 overflow-hidden">
                                                {activity.images?.[activity.cover_image_index ?? 0] ? (
                                                    <img
                                                        src={activity.images[activity.cover_image_index ?? 0]}
                                                        alt={activity.title}
                                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-bg-surface flex items-center justify-center">
                                                        <CategoryIcon size={48} className="text-text-muted" />
                                                    </div>
                                                )}
                                                <div className="absolute inset-0 bg-gradient-to-t from-bg-card via-transparent to-transparent" />

                                                {/* Hover Details Overlay - Hidden on touch devices */}
                                                <div className="absolute inset-0 bg-text-accent/80 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 hidden sm:flex">
                                                    <span className="px-4 py-2 bg-white text-text-accent font-semibold rounded-full flex items-center gap-2 text-sm">
                                                        Voir les détails
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                                        </svg>
                                                    </span>
                                                </div>
                                                
                                                {/* Mobile touch indicator */}
                                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent sm:hidden">
                                                    <span className="text-white text-xs font-medium flex items-center gap-1">
                                                        Appuyer pour les détails
                                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                            <path d="M5 12h14M12 5l7 7-7 7"/>
                                                        </svg>
                                                    </span>
                                                </div>

                                                {/* Category Badge */}
                                                <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border ${categoryColor}`}>
                                                    {activity.category || 'Activité'}
                                                </div>

                                                {/* Image Count */}
                                                {activity.images?.length > 1 && (
                                                    <div className="absolute bottom-4 right-4 px-2 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-xs">
                                                        +{activity.images.length - 1}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Content */}
                                            <div className="p-6">
                                                <h3 className="text-lg font-bold text-text-primary mb-2 group-hover:text-text-accent transition-colors line-clamp-2">
                                                    {activity.title}
                                                </h3>

                                                <div className="flex items-center gap-4 text-xs text-text-muted mb-3">
                                                    {activity.date_start && (
                                                        <span className="flex items-center gap-1">
                                                            <Calendar size={12} />
                                                            {formatDateRange(activity.date_start, activity.date_end)}
                                                        </span>
                                                    )}
                                                    {activity.location && (
                                                        <span className="flex items-center gap-1">
                                                            <MapPin size={12} />
                                                            {activity.location}
                                                        </span>
                                                    )}
                                                </div>

                                                <p className="text-text-secondary text-sm line-clamp-3">
                                                    {activity.description}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })
                            )}
                        </AnimatePresence>
                    </div>
                </Container>
            </main>

            {/* Modal */}
            <AnimatePresence>
                {selectedActivity && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            className="relative w-full max-w-4xl max-h-[90vh] bg-bg-card rounded-2xl overflow-hidden"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={closeModal}
                                className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                            >
                                <X size={20} />
                            </button>

                            <div className="flex flex-col lg:flex-row max-h-[90vh] overflow-y-auto">
                                {/* Image Gallery */}
                                <div className="relative lg:w-1/2 h-48 sm:h-64 lg:h-auto min-h-[200px] bg-bg-surface flex-shrink-0">
                                    {selectedActivity.images?.length > 0 ? (
                                        <>
                                            <img
                                                src={selectedActivity.images[currentImageIndex]}
                                                alt={selectedActivity.title}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* Navigation Arrows */}
                                            {selectedActivity.images.length > 1 && (
                                                <>
                                                    <button
                                                        onClick={prevImage}
                                                        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                                                    >
                                                        <ChevronLeft size={18} className="sm:w-5 sm:h-5" />
                                                    </button>
                                                    <button
                                                        onClick={nextImage}
                                                        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 bg-black/50 hover:bg-black/70 rounded-full text-white transition-colors"
                                                    >
                                                        <ChevronRight size={18} className="sm:w-5 sm:h-5" />
                                                    </button>

                                                    {/* Dots */}
                                                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                                                        {selectedActivity.images.map((_, idx) => (
                                                            <button
                                                                key={idx}
                                                                onClick={() => setCurrentImageIndex(idx)}
                                                                className={`w-2 h-2 rounded-full transition-colors ${
                                                                    idx === currentImageIndex ? 'bg-white' : 'bg-white/50'
                                                                }`}
                                                            />
                                                        ))}
                                                    </div>
                                                </>
                                            )}
                                        </>
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Users size={64} className="text-text-muted" />
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="lg:w-1/2 p-6 lg:p-8 overflow-y-auto">
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                                            categoryColors[selectedActivity.category] || categoryColors.default
                                        }`}>
                                            {selectedActivity.category || 'Activité'}
                                        </span>
                                    </div>

                                    <h2 className="text-xl sm:text-2xl font-bold text-text-primary mb-4">
                                        {selectedActivity.title}
                                    </h2>

                                    <div className="flex flex-wrap items-center gap-4 text-sm text-text-muted mb-6">
                                        {selectedActivity.date_start && (
                                            <span className="flex items-center gap-1.5">
                                                <Calendar size={14} />
                                                {formatDateRange(selectedActivity.date_start, selectedActivity.date_end)}
                                            </span>
                                        )}
                                        {selectedActivity.location && (
                                            <span className="flex items-center gap-1.5">
                                                <MapPin size={14} />
                                                {selectedActivity.location}
                                            </span>
                                        )}
                                    </div>

                                    <div className="prose prose-invert max-w-none">
                                        <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">
                                            {selectedActivity.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <Footer />
        </div>
    );
}
