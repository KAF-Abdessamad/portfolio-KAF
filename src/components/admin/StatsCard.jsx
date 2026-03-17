import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, trend, color = 'accent' }) {
    const colorClasses = {
        accent: 'text-accent bg-accent/10 border-accent/20',
        purple: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
        green: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        red: 'text-red-500 bg-red-500/10 border-red-500/20'
    };

    const selectedColor = colorClasses[color] || colorClasses.accent;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-secondary/50 backdrop-blur-xl border border-slate-800 p-6 rounded-2xl shadow-sm"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-slate-400 text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-white">{value}</h3>

                    {trend && (
                        <div className={`mt-2 text-xs font-medium flex items-center gap-1 ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                            {trend} par rapport au mois dernier
                        </div>
                    )}
                </div>

                <div className={`p-3 rounded-xl border ${selectedColor}`}>
                    <Icon size={24} />
                </div>
            </div>
        </motion.div>
    );
}
