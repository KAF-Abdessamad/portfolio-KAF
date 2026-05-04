import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, ExternalLink, ArrowUpRight, ImageOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import Badge from './Badge';

export default function ProjectCard({ project, onClick }) {
    const { t, i18n } = useTranslation();
    const [imageError, setImageError] = useState(false);
    const isEn = i18n.language.startsWith('en');

    // Normalize Supabase vs Local Mock data fields
    const title = isEn ? (project.title_en || project.title) : project.title;
    const description = isEn ? (project.description_en || project.description) : project.description;
    const imageUrl = project.image_url || project.image;
    const githubUrl = project.github_url || project.github;
    const liveUrl = project.live_url || project.demo || project.live;
    const techStack = project.tech_stack || project.technologies || [];
    const category = project.category;
    const featured = project.featured;

    const fallbackImage = "https://images.unsplash.com/photo-1614850523296-62c0af475430?auto=format&fit=crop&q=80&w=800";

    return (
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="group relative bg-bg-card border border-border-def rounded-2xl overflow-hidden shadow-theme-sm hover:border-accent transition-colors duration-500"
        >
            {/* Project Image */}
            <div className="relative h-60 overflow-hidden bg-bg-surface">
                {!imageError ? (
                    <img
                        src={imageUrl || fallbackImage}
                        alt={title}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-text-mut bg-bg-surface/50">
                        <ImageOff size={48} className="mb-2 opacity-20" />
                        <span className="text-xs font-mono uppercase tracking-widest opacity-40">{t('projects.image_not_available')}</span>
                    </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

                {/* Hover Overlay with Button */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <button
                        onClick={() => onClick(project)}
                        className="px-6 py-3 bg-accent text-text-inv font-bold rounded-lg flex items-center space-x-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 shadow-theme-md"
                    >
                        <span>{t('projects.details')}</span>
                        <ArrowUpRight size={18} />
                    </button>
                </div>

                {/* Top Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                    <Badge variant="accent" className="backdrop-blur-md bg-neon-cyan/20">
                        {category}
                    </Badge>
                    {featured && (
                        <Badge variant="primary" className="backdrop-blur-md bg-bg-surface/20">
                            ⭐ {t('projects.featured')}
                        </Badge>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-6">
                <h3 className="text-xl font-bold text-text-pri mb-2 group-hover:text-text-acc transition-colors">
                    {title}
                </h3>
                <p className="text-text-sec text-sm line-clamp-2 mb-4">
                    {description}
                </p>

                {/* Tech Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                    {techStack.slice(0, 3).map((tech) => (
                        <span key={tech} className="text-[10px] uppercase tracking-widest text-text-mut border border-border-def px-2 py-1 rounded">
                            {tech}
                        </span>
                    ))}
                    {techStack.length > 3 && (
                        <span className="text-[10px] text-text-mut">+{techStack.length - 3}</span>
                    )}
                </div>

                {/* Links */}
                <div className="flex items-center justify-between pt-4 border-t border-border-def/50">
                    <div className="flex space-x-4">
                        {githubUrl && (
                            <a href={githubUrl} target="_blank" rel="noreferrer" className="text-text-mut hover:text-text-pri transition-colors">
                                <Github size={18} />
                            </a>
                        )}
                        {liveUrl && (
                            <a href={liveUrl} target="_blank" rel="noreferrer" className="text-text-mut hover:text-text-pri transition-colors">
                                <ExternalLink size={18} />
                            </a>
                        )}
                    </div>
                    <button
                        onClick={() => onClick(project)}
                        className="text-xs font-mono text-text-acc hover:underline tracking-widest uppercase"
                    >
                        {t('projects.read_more')}
                    </button>
                </div>
            </div>
        </motion.div>
    );
}



