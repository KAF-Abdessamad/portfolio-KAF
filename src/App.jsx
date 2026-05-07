import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AdminProvider } from './context/AdminContext';
import AdminRoute from './components/admin/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';

// Public Pages
import Home from './pages/Home';
import CertificatesPage from './pages/CertificatesPage';
import CVPage from './pages/CVPage';
import ActivitiesPage from './pages/ActivitiesPage';

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
import ActivitiesPageAdmin from './pages/admin/ActivitiesPage';

import { useEffect } from 'react';

import { useNavigate, useLocation } from 'react-router-dom';

// Component to handle the redirect to home on refresh
function HomeRedirect({ children }) {
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname;
        const isAdmin = path.startsWith('/admin');
        const isHome = path === '/';
        const isPublicPage = ['/cv', '/certificates', '/activities'].includes(path);
        
        if (!isAdmin && !isHome && !isPublicPage) {
            navigate('/', { replace: true });
        }
    }, []); // Only run once on mount (refresh)

    return children;
}

function App() {
    return (
        <HelmetProvider>
            <AdminProvider>
                <BrowserRouter>
                    <HomeRedirect>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<Home />} />
                            <Route path="/certificates" element={<CertificatesPage />} />
                            <Route path="/cv" element={<CVPage />} />
                            <Route path="/activities" element={<ActivitiesPage />} />

                            {/* Admin Routes - Protected by Login */}
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
                            <Route path="activities" element={<ActivitiesPageAdmin />} />
                            <Route path="settings" element={<SettingsPage />} />
                        </Route>

                        {/* Fallback */}
                            {/* Fallback */}
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </HomeRedirect>
                </BrowserRouter>
            </AdminProvider>
        </HelmetProvider>
    );
}

export default App;
