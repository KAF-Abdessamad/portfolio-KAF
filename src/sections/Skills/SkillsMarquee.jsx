import React from 'react';
import { motion } from 'framer-motion';
import { getIcon, getBrandColor } from '../../lib/constants/devicons';

const MarqueeItem = ({ skill }) => {
    const Icon = getIcon(skill.icon_key);
    const brandColor = getBrandColor(skill.icon_key, skill.color);

    return (
        <div className="group relative flex-shrink-0">
            <div className="w-[90px] h-[90px] flex flex-col items-center justify-center gap-2 bg-bg-card/80 backdrop-blur-md border border-border-def rounded-xl transition-all duration-500 hover:scale-115 hover:border-[var(--brand-color)] hover:shadow-lg hover:shadow-[var(--brand-color)]/20"
                style={{ '--brand-color': brandColor }}>
                <div
                    className="transition-all duration-500 group-hover:drop-shadow-[0_0_8px_var(--brand-color)]"
                    style={{ color: brandColor }}
                >
                    {Icon ? <Icon size={42} /> : <div className="text-xl font-bold">{skill.name[0]}</div>}
                </div>
                <span className="text-[10px] font-mono text-text-mut uppercase tracking-tighter opacity-0 group-hover:opacity-100 transition-opacity">
                    {skill.name}
                </span>
            </div>

            {/* Tooltip Level */}
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-accent text-text-inv text-[10px] font-bold rounded opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none transform translate-y-2 group-hover:translate-y-0 shadow-theme-sm">
                {skill.level}
            </div>
        </div>
    );
};

export default function SkillsMarquee({ skills }) {
    if (!skills || skills.length === 0) return null;

    // Split skills into 3 rows
    const rowCount = 3;
    const skillsPerRow = Math.ceil(skills.length / rowCount);
    const rows = [
        skills.slice(0, skillsPerRow),
        skills.slice(skillsPerRow, skillsPerRow * 2),
        skills.slice(skillsPerRow * 2),
    ];

    return (
        <div className="space-y-6 mb-20 relative px-4 overflow-hidden">
            {/* Faded edges */}
            <div className="absolute left-0 top-0 h-full w-32 bg-gradient-to-r from-bg-primary to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 h-full w-32 bg-gradient-to-l from-bg-primary to-transparent z-10 pointer-events-none" />

            {rows.map((rowSkills, idx) => {
                if (rowSkills.length === 0) return null;

                // Triple items for seamless scroll
                const duplicated = [...rowSkills, ...rowSkills, ...rowSkills];
                const direction = idx === 1 ? 'left' : 'right';
                const speed = idx === 0 ? 30 : idx === 1 ? 45 : 35; // seconds

                return (
                    <div
                        key={idx}
                        className="group/row flex overflow-hidden mask-fade-x select-none"
                    >
                        <div
                            className={`flex items-center gap-6 py-4 hover:[animation-play-state:paused] ${direction === 'right' ? 'animate-marquee-right' : 'animate-marquee-left'}`}
                            style={{ animationDuration: `${rowSkills.length * 3 + speed}s` }}
                        >
                            {duplicated.map((skill, sIdx) => (
                                <MarqueeItem key={`${skill.id}-${idx}-${sIdx}`} skill={skill} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}


