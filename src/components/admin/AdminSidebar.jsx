import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    Award,
    FileText,
    MessageSquare,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    UserCircle,
    Zap,
    GraduationCap,
    Sparkles,
    Home,
    Menu,
    X
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { cn } from '../../lib/utils';
import ThemeToggle from '../common/ThemeToggle';

const navItems = [
    { name: 'Vue d\'ensemble', href: '/admin', icon: LayoutDashboard },
    { name: 'Page d\'accueil', href: '/admin/home', icon: Home },
    { name: 'Expériences', href: '/admin/experience', icon: GraduationCap },
    { name: 'Projets', href: '/admin/projects', icon: Briefcase },
    { name: 'Activités', href: '/admin/activities', icon: Sparkles },
    { name: 'Certificats', href: '/admin/certificates', icon: Award },
    { name: 'Compétences', href: '/admin/skills', icon: Zap },
    { name: 'CV / Résumé', href: '/admin/cv', icon: FileText },
    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const { logout, user } = useAdmin();
    const navigate = useNavigate();
    const location = useLocation();

    // Close mobile menu on route change
    useEffect(() => {
        setMobileOpen(false);
    }, [location.pathname]);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <>
            {/* Mobile Top Navbar with Hamburger */}
            <header className="lg:hidden sticky top-0 z-40 w-full bg-bg-card/95 backdrop-blur-md border-b border-border-def px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 font-bold text-lg text-text-pri">
                    <span className="text-text-acc">KAF</span> Admin
                </div>
                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    <button
                        type="button"
                        onClick={() => setMobileOpen(!mobileOpen)}
                        aria-label={mobileOpen ? "Fermer le menu" : "Ouvrir le menu"}
                        className="p-2 rounded-xl bg-bg-surface border border-border-def text-text-pri hover:text-text-acc transition-colors focus:outline-none"
                    >
                        {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                    </button>
                </div>
            </header>

            {/* Mobile Drawer Backdrop */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMobileOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-xs z-40"
                    />
                )}
            </AnimatePresence>

            {/* Desktop and Mobile Sidebar */}
            <aside
                className={cn(
                    "fixed top-0 bottom-0 bg-bg-card/95 backdrop-blur-xl border-r border-border-def transition-all duration-300 z-40 flex flex-col",
                    // Desktop positioning & width
                    isCollapsed ? "lg:w-20" : "lg:w-64",
                    // Mobile slide-over drawer behavior
                    mobileOpen ? "left-0 w-72 shadow-2xl" : "-left-full lg:left-0"
                )}
            >
                {/* Header */}
                <div className="p-5 flex items-center justify-between border-b border-border-def">
                    <div className="text-xl font-bold text-text-pri flex items-center gap-2">
                        {(!isCollapsed || mobileOpen) && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                            >
                                <span className="text-text-acc">KAF</span> Admin
                            </motion.span>
                        )}
                    </div>
                    <div className="flex items-center gap-1.5">
                        {(!isCollapsed || mobileOpen) && <ThemeToggle />}
                        {/* Desktop collapse button */}
                        <button
                            type="button"
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            aria-label="Réduire le menu"
                            className="hidden lg:flex p-1.5 rounded-lg bg-bg-surface border border-border-def text-text-sec hover:text-text-acc transition-colors"
                        >
                            {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                        </button>
                        {/* Mobile close button */}
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            aria-label="Fermer"
                            className="lg:hidden p-1.5 rounded-lg bg-bg-surface border border-border-def text-text-sec hover:text-text-acc transition-colors"
                        >
                            <X size={18} />
                        </button>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="flex-1 overflow-y-auto py-5 px-3 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.href}
                            to={item.href}
                            end={item.href === '/admin'}
                            className={({ isActive }) => cn(
                                "flex items-center gap-3 px-3.5 py-3 rounded-xl transition-all group relative text-sm font-medium",
                                isActive
                                    ? "bg-accent/15 text-text-acc border border-accent/25 shadow-xs font-semibold"
                                    : "text-text-sec hover:bg-bg-surface hover:text-text-pri"
                            )}
                        >
                            <item.icon size={20} className="min-w-[20px] shrink-0" />
                            {(!isCollapsed || mobileOpen) && (
                                <span className="truncate">{item.name}</span>
                            )}
                            {/* Tooltip for desktop collapsed state */}
                            {isCollapsed && !mobileOpen && (
                                <div className="hidden lg:block absolute left-full ml-3 px-2.5 py-1 bg-bg-surface border border-border-def rounded-lg text-xs text-text-pri opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50 shadow-theme-md">
                                    {item.name}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="p-4 border-t border-border-def space-y-3">
                    {(!isCollapsed || mobileOpen) && (
                        <div className="px-3 py-2.5 bg-bg-surface border border-border-def rounded-xl flex items-center gap-3">
                            <div className="w-8 h-8 rounded-full bg-accent/15 text-text-acc flex items-center justify-center shrink-0">
                                <UserCircle size={18} />
                            </div>
                            <div className="overflow-hidden">
                                <p className="text-[10px] text-text-mut uppercase tracking-wider font-mono">Connecté</p>
                                <p className="text-xs font-medium text-text-pri truncate">{user?.email || 'admin@kaf.me'}</p>
                            </div>
                        </div>
                    )}

                    <button
                        type="button"
                        onClick={handleLogout}
                        className={cn(
                            "w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-text-sec hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all text-sm",
                            isCollapsed && !mobileOpen ? "justify-center" : ""
                        )}
                    >
                        <LogOut size={18} className="shrink-0" />
                        {(!isCollapsed || mobileOpen) && <span className="font-medium">Déconnexion</span>}
                    </button>
                </div>
            </aside>
        </>
    );
}
