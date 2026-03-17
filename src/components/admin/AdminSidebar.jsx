import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    Briefcase,
    Award,
    FileText,
    MessageSquare,
    BarChart3,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    UserCircle,
    Zap
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { cn } from '../../lib/utils'; // Assuming this utility exists, otherwise I'll use simple template literals

const navItems = [
    { name: 'Vue d\'ensemble', href: '/admin', icon: LayoutDashboard },
    { name: 'Projets', href: '/admin/projects', icon: Briefcase },
    { name: 'Certificats', href: '/admin/certificates', icon: Award },
    { name: 'Compétences', href: '/admin/skills', icon: Zap },
    { name: 'CV / Résumé', href: '/admin/cv', icon: FileText },

    { name: 'Messages', href: '/admin/messages', icon: MessageSquare },
    { name: 'Statistiques', href: '/admin/stats', icon: BarChart3 },
    { name: 'Paramètres', href: '/admin/settings', icon: Settings },
];

export default function AdminSidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const { logout, user } = useAdmin();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/admin/login');
        } catch (err) {
            console.error('Logout failed:', err);
        }
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 h-screen bg-secondary/80 backdrop-blur-xl border-r border-slate-800 transition-all duration-300 z-50 flex flex-col",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            {/* Header */}
            <div className="p-6 flex items-center justify-between border-b border-slate-800">
                <AnimatePresence mode="wait">
                    {!isCollapsed && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -10 }}
                            className="text-xl font-bold text-white flex items-center gap-2"
                        >
                            <span className="text-accent">KAF</span> Admin
                        </motion.div>
                    )}
                </AnimatePresence>
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg bg-primary border border-slate-800 text-slate-400 hover:text-accent transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
                {navItems.map((item) => (
                    <NavLink
                        key={item.href}
                        to={item.href}
                        end={item.href === '/admin'}
                        className={({ isActive }) => cn(
                            "flex items-center gap-3 px-3 py-3 rounded-xl transition-all group relative",
                            isActive
                                ? "bg-accent/10 text-accent border border-accent/20"
                                : "text-slate-400 hover:bg-slate-800/50 hover:text-white"
                        )}
                    >
                        <item.icon size={22} className="min-w-[22px]" />
                        {!isCollapsed && (
                            <motion.span
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="font-medium truncate"
                            >
                                {item.name}
                            </motion.span>
                        )}
                        {/* Tooltip for collapsed state */}
                        {isCollapsed && (
                            <div className="absolute left-full ml-4 px-2 py-1 bg-secondary border border-slate-800 rounded text-xs text-white opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                                {item.name}
                            </div>
                        )}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom Section */}
            <div className="p-4 border-t border-slate-800 space-y-4">
                {!isCollapsed && (
                    <div className="px-2 py-3 bg-primary/50 border border-slate-800 rounded-xl flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">
                            <UserCircle size={20} />
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-xs text-slate-500 truncate uppercase tracking-widest">Connecté en tant que</p>
                            <p className="text-sm font-medium text-white truncate">{user?.email}</p>
                        </div>
                    </div>
                )}

                <button
                    onClick={handleLogout}
                    className={cn(
                        "w-full flex items-center gap-3 px-3 py-3 rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-500 transition-all",
                        isCollapsed ? "justify-center" : ""
                    )}
                >
                    <LogOut size={22} className="min-w-[22px]" />
                    {!isCollapsed && <span className="font-medium">Déconnexion</span>}
                </button>
            </div>
        </aside>
    );
}

