import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Layout, Database, Terminal, Cpu } from 'lucide-react';
import Section from '../../components/layout/Section';
import Container from '../../components/layout/Container';
import { useSkills } from '../../hooks/useSkills';
import SkillCard from './SkillCard';
import SkillMarquee from './SkillMarquee';

const CATEGORY_ICONS = {

    'Languages': <Terminal size={18} />,
    'Frameworks': <Layout size={18} />,
    'Tools': <Zap size={18} />,
    'Databases': <Database size={18} />,
    'DevOps': <Cpu size={18} />,
    'Concepts': <Shield size={18} />,
};

export default function Skills() {
    const { skills, grouped, loading, error } = useSkills();
    const [selectedCategory, setSelectedCategory] = useState('All');

    const categories = ['All', ...Object.keys(grouped)];

    const displayedSkills = selectedCategory === 'All'
        ? skills
        : grouped[selectedCategory] || [];

    if (error) return null; // Silence error or show minimal fallback

    return (
        <Section id="skills" className="relative overflow-hidden">
            {/* Decorative background elements */}
            <div className="absolute top-1/4 -left-20 w-80 h-80 bg-secondary/5 rounded-full blur-[120px] -z-10" />
            <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary-light/10 rounded-full blur-[120px] -z-10" />

            <Container>
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        className="inline-block px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-mono uppercase tracking-widest mb-4"
                    >
                        Expertise Technique
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tighter mb-4">
                        Mes <span className="text-secondary text-glow">Compétences</span>
                    </h2>
                    <p className="text-slate-400 max-w-2xl mx-auto">
                        Une sélection de technologies et d'outils que j'utilise pour donner vie à des expériences numériques innovantes.
                    </p>
                </div>

                {/* Skills Marquee (Featured) */}
                {!loading && <SkillMarquee skills={skills.filter(s => s.featured)} />}

                {/* Category Filter */}

                <div className="flex flex-wrap justify-center gap-3 mb-12">
                    {categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setSelectedCategory(cat)}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl border text-sm font-medium transition-all duration-300 ${selectedCategory === cat
                                ? 'bg-secondary text-primary border-secondary shadow-[0_0_20px_rgba(56,255,189,0.3)]'
                                : 'bg-slate-900/50 text-slate-400 border-slate-800 hover:border-slate-700 hover:text-white'
                                }`}
                        >
                            {CATEGORY_ICONS[cat]}
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Skills Grid */}
                <div className="relative min-h-[400px]">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <div className="w-10 h-10 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
                        </div>
                    ) : (
                        <motion.div
                            layout
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            <AnimatePresence mode="popLayout">
                                {displayedSkills.map((skill, index) => (
                                    <SkillCard
                                        key={skill.id}
                                        skill={skill}
                                        index={index}
                                    />
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    )}

                    {!loading && displayedSkills.length === 0 && (
                        <div className="text-center py-20 text-slate-500 font-mono">
                            Aucune compétence trouvée dans cette catégorie.
                        </div>
                    )}
                </div>
            </Container>
        </Section>
    );
}
