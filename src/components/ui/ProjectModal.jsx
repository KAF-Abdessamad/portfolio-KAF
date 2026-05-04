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
    const isEn = i18n.language.startsWith('en');

    if (!project) return null;

    // Normalization
    const title = isEn ? (project.title_en || project.title) : project.title;
    const description = isEn ? (project.long_description_en || project.long_description) : project.long_description;
    const imageUrl = project.image_url || project.image;
    const githubUrl = project.github_url || project.github;
    const liveUrl = project.live_url || project.demo || project.live;
    const techStack = project.tech_stack || project.technologies || [];
    const challenges = project.challenges || [];
    const gallery = project.gallery || [];

    const fallbackImage = "https://images.unsplash.com/photo-1614850523296-62c0af475430?auto=format&fit=crop&q=80&w=800";

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div className="space-y-8">
                {/* Gallery/Image Section */}
                <div className="relative rounded-xl overflow-hidden bg-bg-surface aspect-video group">
                    {!imageError ? (
                        <img
                            src={imageUrl || fallbackImage}
                            alt={title}
                            onError={() => setImageError(true)}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-text-mut bg-bg-surface/50">
                            <ImageOff size={64} className="mb-4 opacity-20" />
                            <span className="text-sm font-mono uppercase tracking-widest opacity-40">{t('projects.preview_not_available')}</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/60 to-transparent" />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h4 className="text-text-acc font-mono text-sm uppercase tracking-widest mb-2">{t('projects.description_title')}</h4>
                            <p className="text-text-sec leading-relaxed text-lg">
                                {description}
                            </p>
                        </div>

                        {challenges.length > 0 && (
                            <div>
                                <h4 className="text-text-sec font-mono text-sm uppercase tracking-widest mb-4">{t('projects.technical_challenges')}</h4>
                                <ul className="space-y-3">
                                    {challenges.map((challenge, i) => (
                                        <li key={i} className="flex items-start space-x-3 text-text-mut">
                                            <CheckCircle2 size={18} className="text-text-sec mt-1 shrink-0" />
                                            <span>{challenge}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {/* Sidebar Info */}
                    <div className="space-y-6">
                        <div>
                            <h4 className="text-text-acc font-mono text-sm uppercase tracking-widest mb-4">{t('projects.technologies')}</h4>
                            <div className="flex flex-wrap gap-2">
                                {techStack.map((tech) => (
                                    <Badge key={tech} variant="outline" className="border border-border-def text-text-sec">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-border-def">
                            <h4 className="text-text-acc font-mono text-sm uppercase tracking-widest mb-4">{t('projects.links')}</h4>
                            <div className="flex flex-col gap-3">
                                {liveUrl && (
                                    <Button
                                        onClick={() => window.open(liveUrl, '_blank')}
                                        className="w-full justify-between group"
                                    >
                                        <span>{t('projects.view_demo')}</span>
                                        <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                )}
                                {githubUrl && (
                                    <Button
                                        variant="secondary"
                                        onClick={() => window.open(githubUrl, '_blank')}
                                        className="w-full justify-between group"
                                    >
                                        <span>{t('projects.source_code')}</span>
                                        <Github size={18} className="group-hover:scale-110 transition-transform" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Gallery (if exists) */}
                {gallery.length > 0 && (
                    <div className="pt-8 border-t border">
                        <h4 className="text-text-accent font-mono text-sm uppercase tracking-widest mb-6 text-center">{t('projects.gallery_title')}</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {gallery.map((img, i) => (
                                <div key={i} className="rounded-lg overflow-hidden border border hover:border-text-text-accent/30 transition-colors">
                                    <img src={img} alt={`${title} screen ${i}`} className="w-full h-auto" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </Modal>
    );
}



