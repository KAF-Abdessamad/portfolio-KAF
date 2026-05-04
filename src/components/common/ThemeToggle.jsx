import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../hooks/useTheme';

const ThemeToggle = () => {
    const { isDark, toggleTheme } = useTheme();

    return (
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-bg-card border border-border-def shadow-theme-sm hover:border-border-str transition-colors overflow-hidden group"
            aria-label="Toggle Theme"
        >
            <div className="relative w-6 h-6">
                <motion.div
                    initial={false}
                    animate={{
                        rotate: isDark ? 0 : 90,
                        scale: isDark ? 1 : 0,
                        opacity: isDark ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
                    className="absolute inset-0 flex items-center justify-center text-neon-cyan"
                >
                    <Moon size={20} fill="currentColor" />
                </motion.div>

                <motion.div
                    initial={false}
                    animate={{
                        rotate: isDark ? -90 : 0,
                        scale: isDark ? 0 : 1,
                        opacity: isDark ? 0 : 1,
                    }}
                    transition={{ duration: 0.4, type: 'spring', stiffness: 200, damping: 20 }}
                    className="absolute inset-0 flex items-center justify-center text-accent"
                >
                    <Sun size={20} fill="currentColor" />
                </motion.div>
            </div>

            {/* Subtle background glow on hover */}
            <div className={isDark
                ? "absolute inset-0 bg-neon-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity"
                : "absolute inset-0 bg-accent/5 opacity-0 group-hover:opacity-100 transition-opacity"
            } />
        </motion.button>
    );
};

export default ThemeToggle;
