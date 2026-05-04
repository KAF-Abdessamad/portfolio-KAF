import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import Section from '../components/layout/Section';
import Container from '../components/layout/Container';
import ProjectCard from '../components/ui/ProjectCard';
import ProjectModal from '../components/ui/ProjectModal';
import { useProjects } from '../hooks/useProjects';
import { useTranslation } from 'react-i18next';

const CATEGORIES = ["Tous", "Web", "Mobile", "3D", "Design"];
const PROJECTS_PER_PAGE = 6;

export default function Projects() {
    const { t } = useTranslation();
    const { projects, loading, error } = useProjects();
    const [activeCategory, setActiveCategory] = useState("All");
    const [selectedProject, setSelectedProject] = useState(null);
    const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_PAGE);

    const categories = ["All", "Web", "Mobile", "3D", "Design"];

    const filteredProjects = useMemo(() => {
        if (!projects) return [];
        if (activeCategory === "All") return projects;
        return projects.filter(p => p.category === activeCategory);
    }, [activeCategory, projects]);

    const displayedProjects = filteredProjects.slice(0, visibleCount);
    const hasMore = visibleCount < filteredProjects.length;

    if (error) return null;

    return (
        <Section id="projects" className="bg-bg-primary pt-24">
            <Container>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-text-pri mb-6"
                        >
                            {t('projects.title').split(' ')[0]} <span className="text-text-acc relative">{t('projects.title').split(' ').slice(1).join(' ')}
                                <span className="absolute bottom-0 left-0 w-full h-[4px] bg-accent/30 -rotate-1 rounded-full"></span>
                            </span>
                        </motion.h2>
                        <p className="text-text-sec text-lg">
                            {t('projects.description')}
                        </p>
                    </div>

                    {/* Filtering System */}
                     <div className="flex flex-wrap gap-3">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    setVisibleCount(PROJECTS_PER_PAGE);
                                }}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border border-border-def ${activeCategory === cat
                                    ? "bg-accent text-text-inv border-accent shadow-accent"
                                    : "bg-bg-surface text-text-mut border-border-def hover:border-text-sec"
                                    }`}
                            >
                                {cat === "All" ? t('projects.all') : cat}
                                {activeCategory === cat && projects && (
                                    <span className="ml-2 bg-text-inv/20 px-2 py-0.5 rounded-full text-[10px]">
                                        {filteredProjects.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Grid */}
                <div className="relative min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            <AnimatePresence mode="popLayout">
                                {displayedProjects.map((project) => (
                                    <ProjectCard
                                        key={project.id}
                                        project={project}
                                        onClick={setSelectedProject}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {/* Empty State */}
                    {!loading && displayedProjects.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-text-mut font-mono italic">{t('projects.no_projects')}</p>
                        </div>
                    )}
                </div>

                {/* Load More Button */}
                {hasMore && !loading && (
                    <div className="flex justify-center mt-16">
                        <button
                            onClick={() => setVisibleCount(prev => prev + PROJECTS_PER_PAGE)}
                            className="group px-8 py-4 bg-transparent border-2 border-border-def text-text-pri rounded-xl font-bold hover:border-accent hover:text-text-acc transition-all duration-300"
                        >
                            {t('projects.load_more')}
                            <motion.span
                                animate={{ y: [0, 5, 0] }}
                                transition={{ repeat: Infinity, duration: 2 }}
                                className="inline-block ml-2"
                            >
                                ↓
                            </motion.span>
                        </button>
                    </div>
                )}
            </Container>

            {/* Project Detail Modal */}
            <ProjectModal
                project={selectedProject}
                isOpen={!!selectedProject}
                onClose={() => setSelectedProject(null)}
            />
        </Section>
    );
}



