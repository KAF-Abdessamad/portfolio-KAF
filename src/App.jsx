import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AdminProvider } from './context/AdminContext';
import SEO from './components/common/SEO';
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

// Layout & UI
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Public Sections
import Hero from './sections/Hero';
import Skills from './sections/Skills';
import Projects from './sections/Projects';

import Experience from './sections/Experience';
import { CVDownload } from './sections/CV';
import Contact from './sections/Contact';


// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import SkillsPageAdmin from './pages/admin/SkillsPage';
import CertificatesPageAdmin from './pages/admin/CertificatesPage';

import CertificatesPage from './pages/CertificatesPage';
import CVPageAdmin from './pages/admin/CVPage';
import CVPage from './pages/CVPage';

import MessagesPage from './pages/admin/MessagesPage';
import StatsPage from './pages/admin/StatsPage';
import SettingsPage from './pages/admin/SettingsPage';

function App() {
    return (
        <HelmetProvider>
            <AdminProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={
                            <main className="bg-primary min-h-screen">
                                <SEO />
                                <Header />
                                <Hero />
                                <Skills />
                                <Projects />

                                <Experience />
                                <div className="py-20">
                                    <div className="container mx-auto px-6">
                                        <CVDownload />
                                    </div>
                                </div>
                                <Contact />
                                <Footer />

                            </main>
                        } />
                        <Route path="/certificates" element={<CertificatesPage />} />
                        <Route path="/cv" element={<CVPage />} />


                        {/* Admin Routes */}
                        <Route path="/admin/login" element={<LoginPage />} />
                        <Route path="/admin" element={
                            <AdminRoute>
                                <AdminLayout />
                            </AdminRoute>
                        }>
                            <Route index element={<DashboardPage />} />
                            <Route path="projects" element={<ProjectsPage />} />
                            <Route path="skills" element={<SkillsPageAdmin />} />
                            <Route path="certificates" element={<CertificatesPageAdmin />} />

                            <Route path="cv" element={<CVPageAdmin />} />

                            <Route path="messages" element={<MessagesPage />} />
                            <Route path="stats" element={<StatsPage />} />
                            <Route path="settings" element={<SettingsPage />} />
                        </Route>

                        {/* Fallback */}
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </BrowserRouter>
            </AdminProvider>
        </HelmetProvider>
    );
}

export default App;
