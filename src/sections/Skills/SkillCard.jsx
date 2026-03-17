import React from 'react';
import { motion } from 'framer-motion';
import { getIcon, getBrandColor } from '../../lib/constants/devicons';

export default function SkillCard({ skill, index }) {
    const IconComponent = getIcon(skill.icon_key);
    const brandColor = getBrandColor(skill.icon_key, skill.color);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.05 }}
            whileHover={{ y: -5 }}
            className="relative group h-full"
        >
            {/* Ambient Glow */}
            <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-500 blur-xl"
                style={{ backgroundColor: brandColor }}
            />

            <div className="relative h-full bg-slate-900/50 backdrop-blur-sm border border-slate-800 group-hover:border-slate-700 p-6 rounded-2xl overflow-hidden transition-all duration-300">
                {/* Brand Color Top Border */}
                <div
                    className="absolute top-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ backgroundColor: brandColor }}
                />

                <div className="flex items-center gap-4">
                    {/* Icon Container */}
                    <div
                        className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform duration-300"
                        style={{ color: brandColor }}
                    >
                        {IconComponent ? (
                            <IconComponent size={32} />
                        ) : (
                            <span className="text-xl font-bold uppercase">{skill.name.substring(0, 2)}</span>
                        )}
                    </div>

                    <div className="flex-1">
                        <h4 className="text-white font-bold tracking-tight">{skill.name}</h4>
                        <span className="text-[10px] text-slate-500 font-mono uppercase tracking-widest">
                            {skill.level || 'Expertise'}
                        </span>
                    </div>
                </div>

                {/* Level visualization (optional/subtle) */}
                <div className="mt-4 pt-4 border-t border-slate-800/50">
                    <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                        <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: '100%' }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.5 + (index * 0.05) }}
                            className="h-full opacity-30"
                            style={{ backgroundColor: brandColor }}
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
