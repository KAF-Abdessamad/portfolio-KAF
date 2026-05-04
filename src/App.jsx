import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AdminProvider } from './context/AdminContext';
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import Home from './pages/Home';
import CertificatesPage from './pages/CertificatesPage';
import CVPage from './pages/CVPage';

// Admin Pages
import LoginPage from './pages/admin/LoginPage';
import DashboardPage from './pages/admin/DashboardPage';
import ProjectsPage from './pages/admin/ProjectsPage';
import SkillsPageAdmin from './pages/admin/SkillsPage';
import CertificatesPageAdmin from './pages/admin/CertificatesPage';
import CVPageAdmin from './pages/admin/CVPage';
import MessagesPage from './pages/admin/MessagesPage';
import SettingsPage from './pages/admin/SettingsPage';
import ExperiencePageAdmin from './pages/admin/ExperiencePage';

function App() {
    return (
        <HelmetProvider>
            <AdminProvider>
                <BrowserRouter>
                    <Routes>
                        {/* Public Routes */}
                        <Route path="/" element={<Home />} />
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
                            <Route path="experience" element={<ExperiencePageAdmin />} />
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
