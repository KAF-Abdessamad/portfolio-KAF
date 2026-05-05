import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Github, Linkedin, ArrowUpRight } from 'lucide-react';
import Container from './Container';
import { SOCIAL_LINKS } from '../../lib/constants/contact';
import ThemeToggle from '../common/ThemeToggle';
import LanguageSwitcher from '../common/LanguageSwitcher';
import { useScrollNav } from '../../hooks/useScrollNav';
import { useTranslation } from 'react-i18next';

// Ordered section IDs for IntersectionObserver (must match section id="" attributes)
const SECTION_IDS = ['hero', 'projects', 'contact'];

const NAV_LINKS = [
    { key: 'home',       href: '/',              hash: '#hero' },
    { key: 'projects',   href: '/#projects',     hash: '#projects' },
    { key: 'certificates', href: '/certificates', page: '/certificates' },
    { key: 'cv',         href: '/cv',            page: '/cv' },
    { key: 'activities', href: '/activities',    page: '/activities' },
    { key: 'contact',    href: '/#contact',      hash: '#contact' },
];

function isActive(link, activeSection) {
    if (link.page) return activeSection === link.page;
    if (link.hash) return activeSection === link.hash;
    return false;
}

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { activeSection } = useScrollNav(SECTION_IDS);
    const navigate = useNavigate();
    const { t } = useTranslation();

    // Scroll detection
    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Lock body scroll when mobile menu open
    useEffect(() => {
        document.body.style.overflow = mobileOpen ? 'hidden' : '';
        return () => { document.body.style.overflow = ''; };
    }, [mobileOpen]);

    // Handle nav click: smooth-scroll for hash links, navigate for pages
    const handleNavClick = (link, e) => {
        e.preventDefault();
        setMobileOpen(false);

        if (link.page) {
            navigate(link.page);
            window.scrollTo({ top: 0, behavior: 'smooth' });
            return;
        }

        // Hash link: may need to navigate home first
        if (link.hash) {
            const sectionId = link.hash.replace('#', '');
            const el = document.getElementById(sectionId);
            if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                // Navigate to home then scroll after mount
                navigate('/');
                setTimeout(() => {
                    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 400);
            }
        }
    };

    return (
        <>
            <header
                className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                    isScrolled
                        ? 'bg-bg-primary/85 backdrop-blur-xl border-b border-border-def py-2.5'
                        : 'bg-transparent py-5'
                }`}
            >
                <Container>
                    <nav className="flex items-center justify-between">
                        {/* Logo */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <a
                                href="/"
                                onClick={(e) => handleNavClick({ page: null, hash: '#hero', href: '/' }, e)}
                                className="text-2xl font-bold text-text-pri tracking-tighter hover:text-text-acc transition-colors"
                            >
                                KAF<span className="text-text-acc">.</span>
                            </a>
                        </motion.div>

                        {/* Desktop Nav */}
                        <ul className="hidden md:flex items-center space-x-1">
                            {NAV_LINKS.map((link, i) => {
                                const active = isActive(link, activeSection);
                                const name = t(`nav.${link.key}`);
                                return (
                                    <motion.li
                                        key={link.key}
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.07 }}
                                    >
                                        <a
                                            href={link.href}
                                            onClick={(e) => handleNavClick(link, e)}
                                            className={`relative px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-300 ${
                                                active
                                                    ? 'text-text-acc'
                                                    : 'text-text-mut hover:text-text-pri'
                                            }`}
                                        >
                                            {name}
                                            {active && (
                                                <motion.span
                                                    layoutId="nav-pill"
                                                    className="absolute inset-0 bg-bg-surface border border-border-def rounded-md -z-10"
                                                    transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                                                />
                                            )}
                                        </a>
                                    </motion.li>
                                );
                            })}
                        </ul>

                        {/* Desktop Right Actions */}
                        <div className="hidden md:flex items-center space-x-4">
                            <div className="flex items-center space-x-2 border-r border-border-def pr-4">
                                {SOCIAL_LINKS.map((link) => {
                                    const Icon = link.icon === 'github' ? Github : link.icon === 'linkedin' ? Linkedin : null;
                                    if (!Icon) return null;
                                    return (
                                        <a
                                            key={link.name}
                                            href={link.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="p-1.5 rounded-lg hover:bg-bg-elevated text-text-mut hover:text-text-pri transition-all"
                                        >
                                            <Icon size={17} />
                                        </a>
                                    );
                                })}
                            </div>
                            <LanguageSwitcher />
                            <ThemeToggle />
                        </div>

                        {/* Mobile Toggle */}
                        <div className="md:hidden flex items-center space-x-3">
                            <LanguageSwitcher />
                            <ThemeToggle />
                            <button
                                id="mobile-menu-toggle"
                                aria-label={mobileOpen ? t('nav.close') : t('nav.open')}
                                className="p-2 rounded-lg text-text-pri hover:bg-bg-surface transition-colors"
                                onClick={() => setMobileOpen((v) => !v)}
                            >
                                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                            </button>
                        </div>
                    </nav>
                </Container>
            </header>

            {/* ── Fullscreen mobile overlay ── */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        key="mobile-overlay"
                        initial={{ opacity: 0, y: -16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="fixed inset-0 z-40 bg-bg-primary/97 backdrop-blur-2xl flex flex-col"
                    >
                        {/* Close button */}
                        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-border-def">
                            <span className="text-2xl font-bold text-text-pri tracking-tighter">
                                KAF<span className="text-text-acc">.</span>
                            </span>
                            <button
                                aria-label={t('nav.close')}
                                onClick={() => setMobileOpen(false)}
                                className="p-2 rounded-lg text-text-mut hover:text-text-pri hover:bg-bg-surface transition-all"
                            >
                                <X size={22} />
                            </button>
                        </div>

                        {/* Nav links */}
                        <nav className="flex-1 overflow-y-auto px-6 py-8">
                            <ul className="space-y-2">
                                {NAV_LINKS.map((link, i) => {
                                    const active = isActive(link, activeSection);
                                    return (
                                        <motion.li
                                            key={link.key}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.05, duration: 0.3 }}
                                        >
                                            <a
                                                href={link.href}
                                                onClick={(e) => handleNavClick(link, e)}
                                                className={`flex items-center justify-between w-full px-5 py-4 rounded-xl text-lg font-semibold transition-all duration-300 border ${
                                                    active
                                                        ? 'bg-bg-surface border-accent/40 text-text-acc'
                                                        : 'border-transparent text-text-sec hover:bg-bg-surface hover:text-text-pri hover:border-border-def'
                                                }`}
                                            >
                                                {t(`nav.${link.key}`)}
                                                {active && <span className="w-2 h-2 rounded-full bg-accent" />}
                                            </a>
                                        </motion.li>
                                    );
                                })}
                            </ul>
                        </nav>

                        {/* Footer area */}
                        <div className="px-6 pb-10 pt-4 border-t border-border-def">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    {SOCIAL_LINKS.map((link) => {
                                        const Icon = link.icon === 'github' ? Github : link.icon === 'linkedin' ? Linkedin : null;
                                        if (!Icon) return null;
                                        return (
                                            <a
                                                key={link.name}
                                                href={link.url}
                                                target="_blank"
                                                rel="noreferrer"
                                                className="p-2.5 rounded-xl bg-bg-surface border border-border-def text-text-mut hover:text-text-pri hover:border-accent/30 transition-all"
                                            >
                                                <Icon size={20} />
                                            </a>
                                        );
                                    })}
                                </div>
                                <ThemeToggle />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
