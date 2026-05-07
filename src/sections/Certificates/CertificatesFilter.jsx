import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { useTranslation } from 'react-i18next';

const CATEGORIES = ['All', 'Dev', 'Cloud', 'Design', 'Other'];

export default function CertificatesFilter({ activeCategory, setCategory, counts }) {
    const { t } = useTranslation();

    // Filter categories to only show those with certificates (except 'All')
    const visibleCategories = CATEGORIES.filter(catId =>
        catId === 'All' || (counts[catId] || 0) > 0
    );

    return (
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-12">
            {visibleCategories.map((catId) => {
                const isActive = activeCategory === catId;
                const count = counts[catId] || 0;
                
                const label = catId === 'All' 
                    ? t('certificates.filter_all') 
                    : t(`certificates.categories.${catId}`);

                return (
                    <button
                        key={catId}
                        onClick={() => setCategory(catId)}
                        className={cn(
                            "relative px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 flex items-center gap-2 border",
                            isActive
                                ? "text-white border-accent shadow-accent"
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

                        <span>{label}</span>

                        {/* Count Badge */}
                        <span className={cn(
                            "px-1.5 py-0.5 rounded-md text-[10px] font-bold border",
                            isActive
                                ? "bg-white/20 border-white/30 text-white"
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
