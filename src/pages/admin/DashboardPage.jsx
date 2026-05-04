import React, { useMemo } from 'react';
import {
    Eye,
    Plus,
    ArrowUpRight,
    MessageSquare,
    Briefcase,
} from 'lucide-react';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

const QUICK_ACTIONS = [
    { label: 'Gérer les projets', href: '/admin/projects', icon: Briefcase },
    { label: 'Gérer l\'expérience', href: '/admin/experience', icon: ArrowUpRight },
    { label: 'Voir les messages', href: '/admin/messages', icon: MessageSquare },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-text-pri">Tableau de bord</h1>
                    <p className="text-text-sec mt-1">Bienvenue dans votre gestionnaire de portfolio.</p>
                </div>

                <div className="flex items-center gap-3">
                    <Link to="/admin/projects">
                        <Button variant="secondary" className="flex items-center gap-2">
                            <Plus size={18} />
                            <span>Projet</span>
                        </Button>
                    </Link>
                    <Link to="/">
                        <Button variant="primary" className="flex items-center gap-2">
                            <Eye size={18} />
                            <span>Voir le site</span>
                        </Button>
                    </Link>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-bg-card border border-border-def rounded-2xl p-6">
                <h2 className="text-lg font-semibold text-text-pri mb-4">Actions rapides</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {QUICK_ACTIONS.map((action) => (
                        <Link
                            key={action.href}
                            to={action.href}
                            className="flex items-center gap-3 p-4 rounded-xl bg-bg-surface border border-border-def hover:border-text-acc/40 hover:bg-text-acc/5 transition-all group"
                        >
                            <div className="w-9 h-9 rounded-lg bg-text-acc/10 flex items-center justify-center shrink-0 group-hover:bg-text-acc/20 transition-colors">
                                <action.icon size={18} className="text-text-acc" />
                            </div>
                            <span className="font-medium text-text-primary group-hover:text-text-acc transition-colors text-sm">
                                {action.label}
                            </span>
                            <ArrowUpRight size={14} className="ml-auto text-text-mut group-hover:text-text-acc transition-colors" />
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Messages */}
            <div className="bg-bg-card border border-border-def rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-text-pri">Messages récents</h2>
                    <Link to="/admin/messages" className="text-text-acc hover:underline text-sm font-medium">
                        Tout voir
                    </Link>
                </div>

                <div className="space-y-3">
                    {[1, 2, 3].map((_, i) => (
                        <div
                            key={i}
                            className="group p-4 rounded-xl border border-transparent hover:border-border-def hover:bg-bg-surface/40 transition-all cursor-pointer"
                        >
                            <div className="flex items-center justify-between mb-1">
                                <span className="font-semibold text-text-primary group-hover:text-text-acc transition-colors text-sm">
                                    Client Potentiel
                                </span>
                                <span className="text-[10px] text-text-mut font-mono">2h ago</span>
                            </div>
                            <p className="text-xs text-text-sec line-clamp-2">
                                Bonjour, je suis intéressé par vos services de développement React pour un nouveau projet...
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-6 pt-4 border-t border-border-def">
                    <p className="text-xs text-text-mut font-mono text-center italic">
                        EmailJS est également actif pour les notifications externes
                    </p>
                </div>
            </div>
        </div>
    );
}
