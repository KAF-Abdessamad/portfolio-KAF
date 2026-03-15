import React from 'react';
import { motion } from 'framer-motion';
import Container from '../../components/layout/Container';
import ContactInfo from './ContactInfo';
import ContactForm from './ContactForm';

export default function Contact() {
    return (
        <section id="contact" className="relative py-24 bg-primary overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-1/2 left-0 w-1/3 h-[500px] bg-accent/5 blur-[120px] -translate-y-1/2 rounded-full pointer-events-none" />
            <div className="absolute top-0 right-0 w-1/4 h-[400px] bg-[#00f0ff]/5 blur-[100px] rounded-full pointer-events-none" />

            <Container>
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center space-x-2 px-3 py-1.5 mb-6 rounded-full bg-accent/10 border border-accent/20 text-accent text-xs font-mono uppercase tracking-[0.2em]"
                    >
                        Contact
                    </motion.div>
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
                        Générer un <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-[#00f0ff]">Impact.</span>
                    </h2>
                    <p className="text-slate-400 text-lg leading-relaxed">
                        Un projet innovant en tête ? Collaborons pour créer une expérience numérique d'exception.
                    </p>
                </div>

                <div className="glass-card relative max-w-6xl mx-auto">
                    {/* Subtle neon border glow ring framing the entire contact box */}
                    <div className="absolute inset-0 border border-white/10 rounded-2xl pointer-events-none shadow-[0_0_30px_rgba(59,130,246,0.05)]" />

                    <div className="grid grid-cols-1 lg:grid-cols-5 min-h-[600px] rounded-2xl overflow-hidden">
                        {/* Left side: Info */}
                        <motion.div
                            initial={{ x: -50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: "easeOut" }}
                            className="lg:col-span-2"
                        >
                            <ContactInfo />
                        </motion.div>

                        {/* Right side: Form */}
                        <motion.div
                            initial={{ x: 50, opacity: 0 }}
                            whileInView={{ x: 0, opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
                            className="lg:col-span-3 bg-[#050B14]"
                        >
                            <ContactForm />
                        </motion.div>
                    </div>
                </div>
            </Container>
        </section>
    );
}
