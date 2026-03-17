import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { Award, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

function AnimatedCounter({ value }) {
    const [displayValue, setDisplayValue] = useState(0);
    const springValue = useSpring(0, { stiffness: 50, damping: 20 });

    useEffect(() => {
        springValue.set(value);
        return springValue.on("change", (latest) => {
            setDisplayValue(Math.floor(latest));
        });
    }, [value, springValue]);

    return <span>{displayValue}</span>;
}

export default function CertificatesHero({ totalCount }) {
    return (
        <section className="relative pt-32 pb-16 overflow-hidden">
            {/* Background Grid & Glows */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(var(--secondary-rgb),0.15),transparent_50%)]" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-secondary/50 to-transparent" />

            <div className="container mx-auto px-6 relative z-10">
                {/* Breadcrumb */}
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-slate-500 mb-8"
                >
                    <Link to="/" className="hover:text-secondary transition-colors">Accueil</Link>
                    <ChevronRight size={12} />
                    <span className="text-slate-300">Certificats</span>
                </motion.div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
                    <div className="max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-secondary/10 border border-secondary/20 rounded-full text-secondary text-xs font-bold uppercase tracking-widest mb-4"
                        >
                            <Award size={14} />
                            Success & Recognition
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="text-5xl md:text-7xl font-bold text-white tracking-tighter"
                        >
                            Certifications & <br />
                            <span className="text-secondary bg-clip-text text-transparent bg-gradient-to-r from-secondary to-purple-400">
                                Achievements
                            </span>
                        </motion.h1>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3, type: "spring" }}
                        className="bg-primary-light/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl min-w-[200px]"
                    >
                        <div className="text-slate-500 text-sm font-medium mb-1">Total Obtenu</div>
                        <div className="text-5xl font-bold text-white flex items-baseline gap-2">
                            <AnimatedCounter value={totalCount} />
                            <span className="text-secondary text-2xl font-black">+</span>
                        </div>
                        <div className="w-12 h-1 bg-secondary mt-4 rounded-full" />
                    </motion.div>
                </div>
            </div>

            {/* Particle Box (Simulated Decoration) */}
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/4 h-full pointer-events-none opacity-20">
                <div className="absolute top-1/4 right-10 w-2 h-2 bg-secondary rounded-full animate-pulse" />
                <div className="absolute top-1/2 right-20 w-1 h-1 bg-purple-500 rounded-full animate-ping" />
                <div className="absolute bottom-1/4 right-5 w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:1s]" />
            </div>
        </section>
    );
}
