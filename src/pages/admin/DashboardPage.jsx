import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import {
    Briefcase,
    Award,
    MessageSquare,
    Eye,
    TrendingUp,
    Plus,
    ArrowUpRight
} from 'lucide-react';
import StatsCard from '../../components/admin/StatsCard';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';

// Mock data for the chart - in a real app, this would come from the useStats hook
const MOCK_CHART_DATA = [
    { name: 'Lun', visits: 400 },
    { name: 'Mar', visits: 300 },
    { name: 'Mer', visits: 600 },
    { name: 'Jeu', visits: 800 },
    { name: 'Ven', visits: 500 },
    { name: 'Sam', visits: 900 },
    { name: 'Dim', visits: 1100 },
];

export default function DashboardPage() {
    // In a real implementation, we would call our hooks here:
    // const { projects } = useProjects();
    // const { messages } = useMessages();
    // etc.

    return (
        <div className="space-y-8 pb-12">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white">Tableau de bord</h1>
                    <p className="text-slate-400 mt-1">Bienvenue dans votre gestionnaire de portfolio.</p>
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

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Projets"
                    value="12"
                    icon={Briefcase}
                    color="accent"
                    trend="+2"
                />
                <StatsCard
                    title="Certificats"
                    value="8"
                    icon={Award}
                    color="purple"
                    trend="+1"
                />
                <StatsCard
                    title="Messages"
                    value="5"
                    icon={MessageSquare}
                    color="amber"
                    trend="+3"
                />
                <StatsCard
                    title="Visites (Total)"
                    value="2.4k"
                    icon={TrendingUp}
                    color="green"
                    trend="+15%"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visits Chart */}
                <div className="lg:col-span-2 bg-secondary/30 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-white">Activité du site</h2>
                            <p className="text-sm text-slate-400">Visites uniques sur les 7 derniers jours</p>
                        </div>
                        <Link to="/admin/stats" className="text-accent hover:underline text-sm flex items-center gap-1 font-medium">
                            Voir détails <ArrowUpRight size={14} />
                        </Link>
                    </div>

                    <div className="h-[300px] w-full mt-4">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={MOCK_CHART_DATA}>
                                <defs>
                                    <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis
                                    dataKey="name"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1a1a1a',
                                        border: '1px solid #334155',
                                        borderRadius: '8px',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#3b82f6' }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="visits"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorVisits)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Recent Messages Summary */}
                <div className="bg-secondary/30 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl flex flex-col">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white">Messages récents</h2>
                        <Link to="/admin/messages" className="text-accent hover:underline text-sm font-medium">
                            Tout voir
                        </Link>
                    </div>

                    <div className="space-y-4 flex-1">
                        {[1, 2, 3].map((_, i) => (
                            <div key={i} className="group p-4 rounded-xl border border-transparent hover:border-slate-800 hover:bg-primary/40 transition-all cursor-pointer">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="font-semibold text-white group-hover:text-accent transition-colors">Client Potentiel</span>
                                    <span className="text-[10px] text-slate-500 font-mono">2h ago</span>
                                </div>
                                <p className="text-xs text-slate-400 line-clamp-2">
                                    Bonjour, je suis intéressé par vos services de développement React pour un nouveau projet...
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 pt-6 border-t border-slate-800">
                        <p className="text-xs text-slate-500 font-mono text-center italic">
                            EmailJS est également actif pour les notifications externes
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
