import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, Twitter } from 'lucide-react';
import Container from './Container';
import { SOCIAL_LINKS } from '../../lib/constants/contact';

const NAV_LINKS = [
    { name: 'Accueil', href: '/' },
    { name: 'Projets', href: '/#projects' },
    { name: 'Compétences', href: '/#skills' },
    { name: 'Certificats', href: '/certificates' },
    { name: 'CV', href: '/cv' },
    { name: 'Contact', href: '/#contact' },
];


export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-primary/80 backdrop-blur-lg border-b border-slate-800 py-3' : 'bg-transparent py-5'
                }`}
        >
            <Container>
                <nav className="flex items-center justify-between">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-2xl font-bold text-white tracking-tighter"
                    >
                        KAF<span className="text-secondary">.</span>
                    </motion.div>

                    {/* Desktop Nav */}
                    <ul className="hidden md:flex items-center space-x-8">
                        {NAV_LINKS.map((link, i) => (
                            <motion.li
                                key={link.name}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <a
                                    href={link.href}
                                    className="text-sm font-medium text-slate-400 hover:text-secondary transition-colors duration-300"
                                >
                                    {link.name}
                                </a>
                            </motion.li>
                        ))}
                    </ul>

                    <div className="hidden md:flex items-center space-x-4">
                        {SOCIAL_LINKS.map((link) => {
                            const Icon = link.icon === 'github' ? Github : link.icon === 'linkedin' ? Linkedin : link.icon === 'twitter' ? Twitter : null;
                            if (!Icon || link.name === "Twitter") return null; // Keep only Github and Linkedin in header to save space like before, or show all if preferred. Let's show all.
                            return (
                                <a key={link.name} href={link.url} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition-all">
                                    <Icon size={20} />
                                </a>
                            );
                        })}
                    </div>

                    {/* Mobile Toggle */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X /> : <Menu />}
                    </button>
                </nav>
            </Container>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-primary-light border-b border-slate-800 overflow-hidden"
                    >
                        <ul className="px-6 py-8 space-y-6">
                            {NAV_LINKS.map((link) => (
                                <li key={link.name}>
                                    <a
                                        href={link.href}
                                        className="text-lg font-medium text-slate-400 hover:text-secondary block"
                                        onClick={() => setMobileMenuOpen(false)}
                                    >
                                        {link.name}
                                    </a>
                                </li>
                            ))}
                            <div className="flex items-center space-x-6 pt-6 border-t border-slate-800">
                                {SOCIAL_LINKS.map(link => {
                                    const Icon = link.icon === 'github' ? Github : link.icon === 'linkedin' ? Linkedin : link.icon === 'twitter' ? Twitter : null;
                                    if (!Icon) return null;
                                    return (
                                        <a key={link.name} href={link.url} target="_blank" rel="noreferrer">
                                            <Icon size={24} className="text-slate-400" />
                                        </a>
                                    );
                                })}
                            </div>
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </header>
    );
}
