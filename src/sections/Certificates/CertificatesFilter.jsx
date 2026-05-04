import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const CATEGORIES = [
    { id: 'All', label: 'Tous' },
    { id: 'Dev', label: 'Développement' },
    { id: 'Cloud', label: 'Cloud & DevOps' },
    { id: 'Design', label: 'Design' },
    { id: 'Other', label: 'Autres' }
];

export default function CertificatesFilter({ activeCategory, setCategory, counts }) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-12">
            {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                const count = counts[cat.id] || 0;

                return (
                    <button
                        key={cat.id}
                        onClick={() => setCategory(cat.id)}
                        className={cn(
                            "relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 border",
                            isActive
                                ? "text-text-inv border-accent shadow-accent"
                                : "text-text-sec border-border-def hover:border-accent/50 hover:text-text-pri"
                        )}
                    >
                        {/* Animated Active Background */}
                        {isActive && (
                            <motion.div
                                layoutId="activeFilterPill"
                                className="absolute inset-0 bg-accent rounded-full z-[-1]"
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}

                        <span>{cat.label}</span>

                        {/* Count Badge */}
                        <span className={cn(
                            "px-1.5 py-0.5 rounded-md text-[10px] font-bold border",
                            isActive
                                ? "bg-text-inv/20 border-accent/20 text-text-inv"
                                : "bg-bg-surface border-border-def text-text-mut"
                        )}>
                            {count}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
