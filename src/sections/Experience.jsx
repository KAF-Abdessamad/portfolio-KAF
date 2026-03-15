import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Award } from 'lucide-react';
import Section from '../components/layout/Section';
import Container from '../components/layout/Container';
import Badge from '../components/ui/Badge';
import { experiences } from '../constants/experiences';

const TimelineItem = ({ experience, index }) => {
    const isEven = index % 2 === 0;

    return (
        <div className={`relative flex flex-col md:flex-row items-center mb-16 last:mb-0 ${isEven ? 'md:flex-row-reverse' : ''}`}>
            {/* Date Desktop Side */}
            <div className="hidden md:flex w-full md:w-1/2 justify-center px-8">
                <motion.div
                    initial={{ opacity: 0, x: isEven ? -20 : 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="text-right"
                >
                    <span className="text-secondary font-mono tracking-widest text-lg bg-secondary/10 px-4 py-2 rounded-lg border border-secondary/20">
                        {experience.startDate} — {experience.endDate}
                    </span>
                </motion.div>
            </div>

            {/* Central Connector/Dot */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-800 -translate-x-1/2 z-0">
                <div className="sticky top-1/2 w-4 h-4 rounded-full bg-secondary border-4 border-primary shadow-accent z-10 -translate-x-1/2 -ml-[1px]" />
            </div>

            {/* Content Card */}
            <div className="w-full md:w-1/2 pl-16 md:px-12 z-10">
                <motion.div
                    initial={{ opacity: 0, x: isEven ? 30 : -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    className="bg-primary-light border border-slate-800 p-8 rounded-2xl shadow-premium hover:border-secondary/30 transition-colors group"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                        <div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-secondary transition-colors">
                                {experience.title}
                            </h3>
                            <p className="text-lg text-slate-300 font-medium">{experience.company}</p>
                        </div>
                        <div className="md:hidden inline-block">
                            <Badge variant="accent">{experience.startDate} — {experience.endDate}</Badge>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-400 mb-6">
                        <div className="flex items-center gap-1">
                            <MapPin size={14} className="text-secondary" />
                            {experience.location}
                        </div>
                        <div className="flex items-center gap-1">
                            <Briefcase size={14} className="text-secondary" />
                            Full-time
                        </div>
                    </div>

                    <p className="text-slate-400 leading-relaxed mb-6">
                        {experience.description}
                    </p>

                    <div className="space-y-4 mb-8">
                        <h4 className="text-sm font-mono text-secondary uppercase tracking-widest flex items-center gap-2">
                            <Award size={16} />
                            Réalisations Marquantes
                        </h4>
                        <ul className="grid grid-cols-1 gap-3">
                            {experience.achievements.map((item, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm text-slate-400">
                                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-secondary shrink-0" />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {experience.technologies.map(tech => (
                            <span key={tech} className="text-[10px] font-mono text-slate-500 bg-primary px-2 py-1 rounded border border-slate-800 uppercase">
                                {tech}
                            </span>
                        ))}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default function Experience() {
    return (
        <Section id="work" className="bg-[#020c1b] py-24">
            <Container>
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-block px-4 py-1.5 mb-6 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-mono uppercase tracking-[0.2em]"
                    >
                        Ma Carrière
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                        Expériences <span className="text-secondary">Professionnelles</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Un aperçu de mon parcours, des startups agiles aux grandes entreprises technologiques.
                    </p>
                </div>

                <div className="relative pt-10">
                    {experiences.map((exp, index) => (
                        <TimelineItem key={exp.id} experience={exp} index={index} />
                    ))}
                </div>
            </Container>
        </Section>
    );
}
