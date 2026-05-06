import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, CheckCircle2, ChevronRight, ImageOff } from 'lucide-react';
import Modal from './Modal';
import Badge from './Badge';
import Button from './Button';
import { useTranslation } from 'react-i18next';

export default function ProjectModal({ project, isOpen, onClose }) {
    const { t, i18n } = useTranslation();
    const [imageError, setImageError] = useState(false);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const isEn = i18n.language.startsWith('en');

    if (!project) return null;

    // Normalization
    const title = isEn ? (project.title_en || project.title) : project.title;
    
    // Fallback logic: if long_description is empty, use description
    const rawDescription = isEn ? (project.long_description_en || project.long_description) : project.long_description;
    const shortDescription = isEn ? (project.description_en || project.description) : project.description;
    const description = rawDescription || shortDescription;

    const githubUrl = project.github_url || project.github;
    const liveUrl = project.live_url || project.demo || project.live;
    const techStack = project.tech_stack || project.technologies || [];
    const challenges = project.challenges || [];
    
    // Combine cover image and project images into a single gallery
    const coverImage = project.image_url || project.image;
    const projectImages = Array.isArray(project.project_images) ? project.project_images : [];
    const gallery = [coverImage, ...projectImages].filter(Boolean);

    const nextImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
    };

    const prevImage = (e) => {
        e.stopPropagation();
        setCurrentImageIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
    };

    const fallbackImage = "https://images.unsplash.com/photo-1614850523296-62c0af475430?auto=format&fit=crop&q=80&w=800";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-8">
                {/* Carousel Section (Scrollable for tall images) */}
                <div className="relative rounded-xl bg-[#0a0a0a] border border-white/5 shadow-2xl overflow-hidden group">
                    <div className="max-h-[65vh] overflow-y-auto custom-scrollbar flex items-start justify-center bg-black/20">
                        {gallery.length > 0 && !imageError ? (
                            <motion.img
                                key={currentImageIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4 }}
                                src={gallery[currentImageIndex]}
                                alt={`${title} - image ${currentImageIndex + 1}`}
                                onError={() => setImageError(true)}
                                className="w-full h-auto object-top"
                            />
                        ) : (
                            <div className="w-full h-[400px] flex flex-col items-center justify-center text-text-mut bg-bg-surface/50">
                                <ImageOff size={64} className="mb-4 opacity-20" />
                                <span className="text-sm font-mono uppercase tracking-widest opacity-40">{t('projects.preview_not_available')}</span>
                            </div>
                        )}
                    </div>
                    
                    {/* Navigation Arrows (Fixed over the scrollable area) */}
                    {gallery.length > 1 && (
                        <>
                            <button
                                onClick={prevImage}
                                className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10 z-10"
                            >
                                <ChevronRight size={24} className="rotate-180" />
                            </button>
                            <button
                                onClick={nextImage}
                                className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/60 hover:bg-black/80 rounded-full text-white transition-all opacity-0 group-hover:opacity-100 backdrop-blur-md border border-white/10 z-10"
                            >
                                <ChevronRight size={24} />
                            </button>

                            {/* Indicators (Dots) */}
                            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                                {gallery.map((_, idx) => (
                                    <button
                                        key={idx}
                                        onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(idx); }}
                                        className={`h-1.5 rounded-full transition-all duration-300 shadow-lg ${
                                            idx === currentImageIndex ? 'bg-text-acc w-6' : 'bg-white/40 w-1.5'
                                        }`}
                                    />
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-10">
                    {/* Main Info */}
                    <div className="lg:col-span-2 space-y-6 sm:space-y-8">
                        {description && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                                <h4 className="text-text-acc font-mono text-[10px] sm:text-xs uppercase tracking-widest mb-3 opacity-80">{t('projects.description_title')}</h4>
                                <p className="text-text-sec leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                                    {description}
                                </p>
                            </div>
                        )}

                        {challenges.length > 0 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-150">
                                <h4 className="text-text-sec font-mono text-[10px] sm:text-xs uppercase tracking-widest mb-4 opacity-80">{t('projects.technical_challenges')}</h4>
                                <ul className="space-y-3">
                                    {challenges.map((challenge, i) => (
                                        <li key={i} className="flex items-start space-x-3 text-text-mut text-sm sm:text-base">
                                            <CheckCircle2 size={18} className="text-text-sec mt-0.5 shrink-0" />
                                            <span>{challenge}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-8 lg:space-y-10">
                        {techStack.length > 0 && (
                            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 delay-300">
                                <h4 className="text-text-acc font-mono text-[10px] sm:text-xs uppercase tracking-widest mb-4 opacity-80">{t('projects.technologies')}</h4>
                                <div className="flex flex-wrap gap-2">
                                    {techStack.map((tech) => (
                                        <Badge key={tech} variant="outline" className="border border-white/10 text-text-sec bg-white/[0.03] px-3 py-1 text-xs">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(liveUrl || githubUrl) && (
                            <div className="pt-6 sm:pt-8 border-t border-white/5 animate-in fade-in slide-in-from-bottom-4 duration-500 delay-500">
                                <h4 className="text-text-acc font-mono text-[10px] sm:text-xs uppercase tracking-widest mb-5 opacity-80">{t('projects.links')}</h4>
                                <div className="flex flex-col gap-3">
                                    {liveUrl && (
                                        <Button
                                            onClick={() => window.open(liveUrl, '_blank')}
                                            className="w-full justify-between group py-3 px-5"
                                        >
                                            <span className="text-sm font-semibold">{t('projects.view_demo')}</span>
                                            <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    )}
                                    {githubUrl && (
                                        <Button
                                            variant="secondary"
                                            onClick={() => window.open(githubUrl, '_blank')}
                                            className="w-full justify-between group py-3 px-5 bg-white/[0.03] border-white/10"
                                        >
                                            <span className="text-sm font-semibold">{t('projects.source_code')}</span>
                                            <Github size={18} className="group-hover:scale-110 transition-transform" />
                                        </Button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Modal>
    );
}



