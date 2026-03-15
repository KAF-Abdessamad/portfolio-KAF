import React from 'react';
import Container from './Container';
import { Github, Linkedin, Twitter, Mail } from 'lucide-react';
import { CONTACT_INFO, SOCIAL_LINKS } from '../../lib/constants/contact';

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary-light border-t border-slate-800 py-12">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="text-2xl font-bold text-white mb-6 tracking-tighter">
                            KAF<span className="text-secondary">.</span>
                        </div>
                        <p className="text-slate-400 max-w-sm">
                            Ingénieur Full Stack passionné par la création d'expériences numériques immersives et performantes. Basé en France, disponible pour le monde entier.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Navigation</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="text-slate-400 hover:text-secondary transition-colors">Accueil</a></li>
                            <li><a href="#projects" className="text-slate-400 hover:text-secondary transition-colors">Projets</a></li>
                            <li><a href="#about" className="text-slate-400 hover:text-secondary transition-colors">À Propos</a></li>
                            <li><a href="#contact" className="text-slate-400 hover:text-secondary transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-6">Contact</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-3 text-slate-400">
                                <Mail size={18} className="text-secondary" />
                                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-white transition-colors">{CONTACT_INFO.email}</a>
                            </li>
                            <div className="flex items-center space-x-4 pt-2">
                                {SOCIAL_LINKS.map(link => {
                                    const Icon = link.icon === 'github' ? Github : link.icon === 'linkedin' ? Linkedin : link.icon === 'twitter' ? Twitter : null;
                                    if (!Icon) return null;
                                    return (
                                        <a key={link.name} href={link.url} target="_blank" rel="noreferrer" className="p-2 bg-primary rounded-lg text-slate-400 hover:text-white transition-all">
                                            <Icon size={20} />
                                        </a>
                                    );
                                })}
                            </div>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
                    <p>© {currentYear} Abdessamad (KAF). Tous droits réservés.</p>
                    <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
                        <a href="#" className="hover:text-white transition-colors">Mentions légales</a>
                    </div>
                </div>
            </Container>
        </footer>
    );
}
