import React from 'react';
import { motion } from 'framer-motion';
import {
    BarChart3,
    Users,
    MousePointer2,
    Globe,
    Monitor,
    Smartphone,
    TrendingUp,
    Calendar
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';
import StatsCard from '../../components/admin/StatsCard';
import { useStats } from '../../hooks/useStats';

const COLORS = ['#3b82f6', '#a855f7', '#10b981', '#f59e0b', '#ef4444'];

export default function StatsPage() {
    const { totalVisits, dailyStats, loading } = useStats();

    // Mock data for extended stats since we mainly track visits in the current schema
    const deviceData = [
        { name: 'Desktop', value: 65 },
        { name: 'Mobile', value: 25 },
        { name: 'Tablet', value: 10 },
    ];

    const sourceData = [
        { name: 'Direct', visits: 1200 },
        { name: 'GitHub', visits: 800 },
        { name: 'LinkedIn', visits: 450 },
        { name: 'Google', visits: 200 },
    ];

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
                <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin" />
                <p className="text-slate-500 font-mono italic">Calcul des statistiques...</p>
            </div>
        );
    }

    return (
        <div className="space-y-8 pb-12">
            <div>
                <h1 className="text-3xl font-bold text-white">Analytiques</h1>
                <p className="text-slate-400 mt-1">Suivez l'audience et l'engagement de votre portfolio.</p>
            </div>

            {/* Top Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatsCard
                    title="Visiteurs Uniques"
                    value={totalVisits}
                    icon={Users}
                    color="accent"
                />
                <StatsCard
                    title="Pages vues / session"
                    value="3.2"
                    icon={MousePointer2}
                    color="purple"
                />
                <StatsCard
                    title="Taux de conversion"
                    value="4.5%"
                    icon={TrendingUp}
                    color="green"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Traffic Over Time */}
                <div className="lg:col-span-2 bg-secondary/30 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-bold text-white">Trafic Temporel</h2>
                            <p className="text-sm text-slate-400">Visites quotidiennes sur les 30 derniers jours</p>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/40 border border-slate-800 rounded-lg text-xs text-slate-400">
                            <Calendar size={14} />
                            Dernier mois
                        </div>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={dailyStats}>
                                <defs>
                                    <linearGradient id="colorVisitsFull" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                                <XAxis
                                    dataKey="date"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94a3b8', fontSize: 10 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1a1a1a',
                                        border: '1px solid #334155',
                                        borderRadius: '12px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="count"
                                    stroke="#3b82f6"
                                    strokeWidth={3}
                                    fill="url(#colorVisitsFull)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Device Distribution */}
                <div className="bg-secondary/30 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl flex flex-col">
                    <h2 className="text-xl font-bold text-white mb-8">Appareils</h2>

                    <div className="h-[250px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={deviceData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    {deviceData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="space-y-4 mt-8 flex-1">
                        {deviceData.map((item, i) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[i] }}
                                    />
                                    <span className="text-slate-400 text-sm">{item.name}</span>
                                </div>
                                <span className="text-white font-bold">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sources Bar Chart */}
            <div className="bg-secondary/30 backdrop-blur-xl border border-slate-800 p-8 rounded-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <Globe className="text-accent" />
                    <h2 className="text-xl font-bold text-white">Sources d'acquisition</h2>
                </div>

                <div className="h-[250px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={sourceData} layout="vertical">
                            <XAxis type="number" hide />
                            <YAxis
                                dataKey="name"
                                type="category"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: '#fff', fontSize: 13 }}
                                width={100}
                            />
                            <Tooltip
                                cursor={{ fill: 'transparent' }}
                                contentStyle={{ backgroundColor: '#1a1a1a', border: '1px solid #334155' }}
                            />
                            <Bar
                                dataKey="visits"
                                fill="#3b82f6"
                                radius={[0, 4, 4, 0]}
                                barSize={20}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
