import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { Github, Linkedin, Twitter, ArrowRight } from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';
import HeroScene from '../components/3d/HeroScene';
import Container from '../components/layout/Container';
import Button from '../components/ui/Button';
import { SOCIAL_LINKS } from '../lib/constants/contact';

const SUBTITLES = ["React.js", "Three.js", "Node.js", "TypeScript"];


export default function Hero() {
    const [subtitleIndex, setSubtitleIndex] = useState(0);
    const { displayText: titleText } = useTypewriter("Bonjour, je suis Abdessamad - Ingénieur Full Stack", 50, 500);

    const heroRef = useRef(null);

    useEffect(() => {
        const interval = setInterval(() => {
            setSubtitleIndex((prev) => (prev + 1) % SUBTITLES.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            gsap.from(".animate-item", {
                opacity: 0,
                y: 30,
                duration: 1,
                stagger: 0.2,
                ease: "power4.out",
                delay: 0.8
            });
        }, heroRef);
        return () => ctx.revert();
    }, []);

    return (
        <section ref={heroRef} className="relative w-full h-screen min-h-[700px] overflow-hidden bg-primary flex items-center pt-20 md:pt-32">
            {/* 3D Scene Background */}
            <HeroScene />

            {/* Overlay Gradient */}
            <div className="absolute inset-0 z-[1] bg-gradient-to-b from-primary/30 via-transparent to-primary" />

            <Container className="relative z-10 w-full">
                <div className="max-w-4xl relative z-20">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-secondary border border-slate-800 text-accent font-mono text-xs mb-6 shadow-sm shadow-accent/10"
                    >
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
                        </span>
                        <span>DISPONIBLE POUR PROJETS</span>
                    </motion.div>

                    <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                        {titleText}
                        <span className="animate-pulse ml-1 inline-block w-1 h-12 md:h-16 bg-accent align-middle"></span>
                    </h1>

                    <div className="h-12 md:h-16 mb-8 overflow-hidden">
                        <motion.p
                            key={SUBTITLES[subtitleIndex]}
                            initial={{ y: 40, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -40, opacity: 0 }}
                            transition={{ duration: 0.5, ease: "backOut" }}
                            className="text-2xl md:text-4xl text-slate-400 font-mono"
                        >
                            Expert en <span className="text-accent">{SUBTITLES[subtitleIndex]}</span>
                        </motion.p>
                    </div>

                    <div className="flex flex-wrap gap-4 mb-12 animate-item">
                        <a href="#projects" className="group px-8 py-3 bg-accent hover:bg-accent-hover text-white rounded-lg font-medium shadow-accent transition-all duration-300 flex items-center">
                            Voir projets
                            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </a>
                        <a href="#contact" className="px-8 py-3 bg-secondary hover:bg-slate-800 border border-slate-800 text-white rounded-lg font-medium transition-all duration-300">
                            Me contacter
                        </a>
                    </div>

                    <div className="flex items-center space-x-6 animate-item">
                        {SOCIAL_LINKS.map(link => {
                            const Icon = link.icon === 'github' ? Github : link.icon === 'linkedin' ? Linkedin : link.icon === 'twitter' ? Twitter : null;
                            if (!Icon) return null;
                            return (
                                <a key={link.name} href={link.url} target="_blank" rel="noreferrer" className="p-2 rounded-lg bg-secondary border border-slate-800 text-slate-400 hover:text-accent hover:border-slate-700 transition-all duration-300">
                                    <Icon className="w-5 h-5" />
                                </a>
                            );
                        })}
                        <div className="h-[1px] w-12 bg-slate-800" />
                        <span className="text-xs font-mono text-slate-500 uppercase tracking-widest text-nowrap">
                            Connectons-nous
                        </span>
                    </div>
                </div>
            </Container>
        </section>
    );
}
