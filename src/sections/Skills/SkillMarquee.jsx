import React from 'react';
import { motion } from 'framer-motion';
import { getIcon, getBrandColor } from '../../lib/constants/devicons';

export default function SkillMarquee({ skills }) {
    if (!skills || skills.length === 0) return null;

    // Double the skills for a seamless loop
    const duplicatedSkills = [...skills, ...skills, ...skills];

    return (
        <div className="relative w-full overflow-hidden py-10 bg-slate-950/30 border-y border-slate-900/50 mb-12">
            <div className="absolute left-0 top-0 h-full w-20 bg-gradient-to-r from-primary to-transparent z-10" />
            <div className="absolute right-0 top-0 h-full w-20 bg-gradient-to-l from-primary to-transparent z-10" />

            <motion.div
                className="flex items-center gap-12 whitespace-nowrap"
                animate={{ x: [0, -100 * skills.length] }}
                transition={{
                    duration: skills.length * 3,
                    ease: "linear",
                    repeat: Infinity
                }}
            >
                {duplicatedSkills.map((skill, idx) => {
                    const Icon = getIcon(skill.icon_key);
                    const color = getBrandColor(skill.icon_key, skill.color);

                    return (
                        <div
                            key={`${skill.id}-${idx}`}
                            className="flex items-center gap-3 transition-transform duration-300 hover:scale-110 cursor-default group"
                        >
                            <div
                                className="w-10 h-10 flex items-center justify-center rounded-lg bg-slate-900 border border-slate-800 group-hover:border-slate-700 shadow-sm"
                                style={{ color }}
                            >
                                {Icon ? <Icon size={24} /> : <span className="font-bold">{skill.name[0]}</span>}
                            </div>
                            <span className="text-slate-400 font-mono text-sm group-hover:text-white transition-colors uppercase tracking-widest">
                                {skill.name}
                            </span>
                        </div>
                    );
                })}
            </motion.div>
        </div>
    );
}
