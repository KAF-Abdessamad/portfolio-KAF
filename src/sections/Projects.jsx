import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, LayoutGrid, List } from 'lucide-react';
import Section from '../components/layout/Section';
import Container from '../components/layout/Container';
import ProjectCard from '../components/ui/ProjectCard';
import ProjectModal from '../components/ui/ProjectModal';
import { projects } from '../constants/projects';

const CATEGORIES = ["Tous", "Web", "Mobile", "3D", "Design"];
const PROJECTS_PER_PAGE = 6;

export default function Projects() {
    const [activeCategory, setActiveCategory] = useState("Tous");
    const [selectedProject, setSelectedProject] = useState(null);
    const [visibleCount, setVisibleCount] = useState(PROJECTS_PER_PAGE);

    const filteredProjects = useMemo(() => {
        if (activeCategory === "Tous") return projects;
        return projects.filter(p => p.category === activeCategory);
    }, [activeCategory]);

    const displayedProjects = filteredProjects.slice(0, visibleCount);
    const hasMore = visibleCount < filteredProjects.length;

    return (
        <Section id="projects" className="bg-primary pt-24">
            <Container>
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-8">
                    <div className="max-w-2xl">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-4xl md:text-5xl font-bold text-white mb-6"
                        >
                            Mes <span className="text-secondary relative">Projets
                                <span className="absolute bottom-0 left-0 w-full h-[4px] bg-accent-blue/50 -rotate-1 rounded-full"></span>
                            </span>
                        </motion.h2>
                        <p className="text-slate-400 text-lg">
                            Une sélection de mes travaux récents mêlant excellence technique et design soigné.
                        </p>
                    </div>

                    {/* Filtering System */}
                    <div className="flex flex-wrap gap-3">
                        {CATEGORIES.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => {
                                    setActiveCategory(cat);
                                    setVisibleCount(PROJECTS_PER_PAGE);
                                }}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${activeCategory === cat
                                        ? "bg-secondary text-primary border-secondary shadow-accent"
                                        : "bg-primary-light text-slate-400 border-slate-800 hover:border-slate-600"
                                    }`}
                            >
                                {cat}
                                {activeCategory === cat && (
                                    <span className="ml-2 bg-primary/20 px-2 py-0.5 rounded-full text-[10px]">
                                        {filteredProjects.length}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Projects Grid */}
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

                {/* Empty State */}
                {displayedProjects.length === 0 && (
                    <div className="py-20 text-center">
                        <p className="text-slate-500 font-mono italic">Aucun projet trouvé dans cette catégorie.</p>
                    </div>
                )}

                {/* Load More Button */}
                {hasMore && (
                    <div className="flex justify-center mt-16">
                        <button
                            onClick={() => setVisibleCount(prev => prev + PROJECTS_PER_PAGE)}
                            className="group px-8 py-4 bg-transparent border-2 border-slate-800 text-white rounded-xl font-bold hover:border-secondary hover:text-secondary transition-all duration-300"
                        >
                            Voir plus de projets
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
