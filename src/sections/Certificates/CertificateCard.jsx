import React, { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Award, ExternalLink, Calendar, ShieldCheck, Star } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function CertificateCard({ certificate, onClick }) {
    const {
        title,
        issuer,
        issue_date,
        image_url,
        category,
        featured,
        credential_url
    } = certificate;

    // 3D Tilt Effect using Framer Motion
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseXSpring = useSpring(x);
    const mouseYSpring = useSpring(y);

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

    const handleMouseMove = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;

        const xPct = mouseX / width - 0.5;
        const yPct = mouseY / height - 0.5;

        x.set(xPct);
        y.set(yPct);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    const formattedDate = new Date(issue_date).toLocaleDateString('fr-FR', {
        month: 'short',
        year: 'numeric'
    });

    const categoryColors = {
        Dev: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
        Cloud: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
        Design: 'text-pink-400 bg-pink-400/10 border-pink-400/20',
        Other: 'text-slate-400 bg-slate-400/10 border-slate-400/20'
    };

    const colorClass = categoryColors[category] || categoryColors.Other;

    return (
        <motion.div
            style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d",
            }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            onClick={() => onClick(certificate)}
            className="relative group cursor-pointer"
        >
            {/* Neon Glow Background */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-secondary/50 to-purple-500/50 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />

            <div className="relative h-full bg-primary-light/40 backdrop-blur-xl border border-slate-800 rounded-2xl p-5 flex flex-col transition-all duration-300 group-hover:border-slate-700 overflow-hidden">

                {/* Featured Badge */}
                {featured && (
                    <div className="absolute top-3 right-3 z-10 p-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
                        <Star size={14} fill="currentColor" />
                    </div>
                )}

                {/* Image / Badge Container */}
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-5 bg-slate-900/50 flex items-center justify-center group-hover:scale-[1.02] transition-transform duration-500">
                    {image_url ? (
                        <img
                            src={image_url}
                            alt={title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                        />
                    ) : (
                        <Award size={48} className="text-slate-700" />
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-primary/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            whileHover={{ y: 0, opacity: 1 }}
                            className="flex items-center gap-2 px-4 py-2 bg-secondary text-primary font-bold rounded-full text-sm shadow-xl"
                        >
                            Voir Détails
                            <ExternalLink size={14} />
                        </motion.div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col space-y-3">
                    <div className="flex items-center gap-2">
                        <span className={cn("text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border", colorClass)}>
                            {category}
                        </span>
                    </div>

                    <h3 className="text-lg font-bold text-white group-hover:text-secondary transition-colors line-clamp-2 leading-tight">
                        {title}
                    </h3>

                    <div className="space-y-2 mt-auto pt-2">
                        <div className="flex items-center gap-2 text-slate-400 text-sm">
                            <ShieldCheck size={14} className="text-secondary" />
                            <span className="truncate">{issuer}</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-500 text-xs">
                            <Calendar size={14} />
                            <span>Obtenu en {formattedDate}</span>
                        </div>
                    </div>
                </div>

                {/* Modern Decorative Element */}
                <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors" />
            </div>
        </motion.div>
    );
}
