import React from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter, Mail, MapPin, Phone } from 'lucide-react';
import { SOCIAL_LINKS, CONTACT_INFO } from '../../lib/constants/contact';

const ContactInfo = () => {
    const getIcon = (iconName) => {
        switch (iconName) {
            case 'github': return <Github size={24} />;
            case 'linkedin': return <Linkedin size={24} />;
            case 'twitter': return <Twitter size={24} />;
            default: return null;
        }
    };

    return (
        <div className="h-full flex flex-col justify-between p-8 bg-secondary/30 rounded-3xl border border-white/5 backdrop-blur-md relative overflow-hidden">

            {/* Decorative background element */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-accent/20 rounded-full blur-[80px] pointer-events-none" />

            <div className="relative z-10">
                <h3 className="text-3xl font-bold text-white mb-2 tracking-tight">Discutons de votre projet</h3>
                <p className="text-slate-400 mb-10 text-lg leading-relaxed">
                    Que vous ayez une question ou que vous souhaitiez simplement dire bonjour, je ferai de mon mieux pour vous répondre !
                </p>

                <div className="space-y-6">
                    <div className="flex items-center space-x-4 group">
                        <div className="w-12 h-12 rounded-full bg-primary/80 border border-white/10 flex items-center justify-center text-accent group-hover:scale-110 group-hover:border-[#00f0ff] group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300">
                            <Mail size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-1">Email</p>
                            <a href={`mailto:${CONTACT_INFO.email}`} className="text-slate-300 hover:text-white transition-colors text-lg">
                                {CONTACT_INFO.email}
                            </a>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 group">
                        <div className="w-12 h-12 rounded-full bg-primary/80 border border-white/10 flex items-center justify-center text-accent group-hover:scale-110 group-hover:border-[#00f0ff] group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300">
                            <Phone size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-1">Téléphone</p>
                            <p className="text-slate-300 text-lg">{CONTACT_INFO.phone}</p>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4 group">
                        <div className="w-12 h-12 rounded-full bg-primary/80 border border-white/10 flex items-center justify-center text-accent group-hover:scale-110 group-hover:border-[#00f0ff] group-hover:shadow-[0_0_15px_rgba(0,240,255,0.4)] transition-all duration-300">
                            <MapPin size={20} />
                        </div>
                        <div>
                            <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-1">Localisation</p>
                            <p className="text-slate-300 text-lg">{CONTACT_INFO.location}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-16 pt-8 border-t border-white/10 relative z-10">
                <p className="text-sm font-mono text-slate-500 uppercase tracking-widest mb-6">Réseaux Sociaux</p>
                <div className="flex space-x-4">
                    {SOCIAL_LINKS.map((link) => (
                        <motion.a
                            key={link.name}
                            href={link.url}
                            target="_blank"
                            rel="noreferrer"
                            whileHover={{ y: -5, scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="w-12 h-12 rounded-xl bg-primary/50 flex items-center justify-center text-slate-400 hover:text-white border border-white/5 hover:border-[#00f0ff] hover:shadow-[0_0_15px_rgba(0,240,255,0.3)] transition-colors"
                        >
                            {getIcon(link.icon)}
                        </motion.a>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ContactInfo;
