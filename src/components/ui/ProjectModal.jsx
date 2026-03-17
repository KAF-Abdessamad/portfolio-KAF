import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink, CheckCircle2, ChevronRight, ImageOff } from 'lucide-react';
import Modal from './Modal';
import Badge from './Badge';
import Button from './Button';

export default function ProjectModal({ project, isOpen, onClose }) {
    const [imageError, setImageError] = useState(false);

    if (!project) return null;

    // Normalization
    const title = project.title;
    const description = project.long_description || project.fullDescription;
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
                <div className="relative rounded-xl overflow-hidden bg-slate-900 aspect-video group">
                    {!imageError ? (
                        <img
                            src={imageUrl || fallbackImage}
                            alt={title}
                            onError={() => setImageError(true)}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-slate-600 bg-slate-900/50">
                            <ImageOff size={64} className="mb-4 opacity-20" />
                            <span className="text-sm font-mono uppercase tracking-widest opacity-40">Aperçu non disponible</span>
                        </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent" />
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Main Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h4 className="text-secondary font-mono text-sm uppercase tracking-widest mb-2">Description</h4>
                            <p className="text-slate-300 leading-relaxed text-lg">
                                {description}
                            </p>
                        </div>

                        {challenges.length > 0 && (
                            <div>
                                <h4 className="text-secondary font-mono text-sm uppercase tracking-widest mb-4">Défis Techniques</h4>
                                <ul className="space-y-3">
                                    {challenges.map((challenge, i) => (
                                        <li key={i} className="flex items-start space-x-3 text-slate-400">
                                            <CheckCircle2 size={18} className="text-secondary mt-1 shrink-0" />
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
                            <h4 className="text-secondary font-mono text-sm uppercase tracking-widest mb-4">Technologies</h4>
                            <div className="flex flex-wrap gap-2">
                                {techStack.map((tech) => (
                                    <Badge key={tech} variant="outline" className="border-slate-800 text-slate-300">
                                        {tech}
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-800">
                            <h4 className="text-secondary font-mono text-sm uppercase tracking-widest mb-4">Liens</h4>
                            <div className="flex flex-col gap-3">
                                {liveUrl && (
                                    <Button
                                        onClick={() => window.open(liveUrl, '_blank')}
                                        className="w-full justify-between group"
                                    >
                                        <span>Voir Démo</span>
                                        <ExternalLink size={18} className="group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                )}
                                {githubUrl && (
                                    <Button
                                        variant="secondary"
                                        onClick={() => window.open(githubUrl, '_blank')}
                                        className="w-full justify-between group"
                                    >
                                        <span>Code Source</span>
                                        <Github size={18} className="group-hover:scale-110 transition-transform" />
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Dynamic Gallery (if exists) */}
                {gallery.length > 0 && (
                    <div className="pt-8 border-t border-slate-800">
                        <h4 className="text-secondary font-mono text-sm uppercase tracking-widest mb-6 text-center">Galerie du Projet</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {gallery.map((img, i) => (
                                <div key={i} className="rounded-lg overflow-hidden border border-slate-800 hover:border-secondary/30 transition-colors">
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

