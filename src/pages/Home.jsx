import React from 'react';
import SEO from '../components/common/SEO';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../sections/Hero';
import About from '../sections/About/About';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact/Contact';
import { useSiteSettings } from '../hooks/useSiteSettings';

export default function Home() {
    const { settings } = useSiteSettings();
    const homeSections = settings.home?.sections || {};

    const showHero = homeSections.hero !== false;
    const showAbout = homeSections.about !== false;
    const showProjects = homeSections.projects !== false;
    const showContact = homeSections.contact !== false;

    return (
        <main className="bg-bg-primary min-h-screen">
            <SEO />
            <Header />
            {showHero && <Hero />}
            {showAbout && <About />}
            {showProjects && <Projects />}
            {showContact && <Contact />}
            <Footer />
        </main>
    );
}
