import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Tabs({ tabs, activeTab, onChange, className }) {
    return (
        <div className={cn("flex flex-col w-full", className)}>
            <div className="flex border-b border-border-def mb-6 overflow-x-auto no-scrollbar">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => onChange(tab.id)}
                        className={cn(
                            "relative px-6 py-3 text-sm font-medium transition-colors duration-300 whitespace-nowrap",
                            activeTab === tab.id ? "text-text-acc" : "text-text-mut hover:text-text-pri"
                        )}
                    >
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div
                                layoutId="activeTabIndicator"
                                className="absolute bottom-0 left-0 right-0 h-[2px] bg-accent"
                                initial={false}
                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                            />
                        )}
                    </button>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                >
                    {tabs.find((t) => t.id === activeTab)?.content}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}


