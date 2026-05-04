import React from 'react';
import { motion } from 'framer-motion';

export default function StatsCard({ title, value, icon: Icon, trend, color = 'accent' }) {
    const colorClasses = {
        accent: 'text-text-accent bg-text-accent/10 border-accent/20',
        purple: 'text-text-secondary bg-text-secondary/10 border-text-secondary/20',
        green: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
        amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
        red: 'text-red-500 bg-red-500/10 border-red-500/20'
    };

    const selectedColor = colorClasses[color] || colorClasses.accent;

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="bg-bg-card/50 backdrop-blur-xl border border-border p-6 rounded-2xl shadow-sm"
        >
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-text-secondary text-sm font-medium mb-1">{title}</p>
                    <h3 className="text-3xl font-bold text-text-primary">{value}</h3>

                    {trend && (
                        <div className={`mt-2 text-xs font-medium flex items-center gap-1 ${trend.startsWith('+') ? 'text-emerald-500' : 'text-red-500'}`}>
                            {trend} par rapport au mois dernier
                        </div>
                    )}
                </div>

                <div className={`p-3 rounded-xl border border-border ${selectedColor}`}>
                    <Icon size={24} />
                </div>
            </div>
        </motion.div>
    );
}


