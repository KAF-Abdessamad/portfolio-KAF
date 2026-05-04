import React from 'react';
import SEO from '../components/common/SEO';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Projects from '../sections/Projects';
import Contact from '../sections/Contact';

export default function Home() {
    return (
        <main className="bg-bg-primary min-h-screen">
            <SEO />
            <Header />
            <Hero />
            <About />
            <Projects />
            <Contact />
            <Footer />
        </main>
    );
}
