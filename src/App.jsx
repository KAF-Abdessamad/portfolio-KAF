import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import SEO from './components/common/SEO';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './sections/Hero';
import Projects from './sections/Projects';
import Experience from './sections/Experience';
import Contact from './sections/Contact';

function App() {
    return (
        <HelmetProvider>
            <BrowserRouter>
                <main className="bg-primary min-h-screen">
                    <SEO />
                    <Header />
                    <Hero />
                    <Projects />
                    <Experience />
                    <Contact />
                    <Footer />
                </main>
            </BrowserRouter>
        </HelmetProvider>
    );
}

export default App;
