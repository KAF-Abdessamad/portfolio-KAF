import React from 'react';
import Container from './Container';
import { Github, Linkedin, Mail } from 'lucide-react';
import { CONTACT_INFO, SOCIAL_LINKS } from '../../lib/constants/contact';
import { useTranslation } from 'react-i18next';

export default function Footer() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    const handleNav = (e, link) => {
        if (link.startsWith('#')) {
            e.preventDefault();
            const element = document.getElementById(link.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                window.location.href = `/${link}`;
            }
        }
    };

    return (
        <footer className="bg-bg-surface border-t border py-12">
            <Container>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="text-2xl font-bold text-text-primary mb-6 tracking-tighter">
                            KAF<span className="text-text-accent">.</span>
                        </div>
                        <p className="text-text-secondary max-w-sm">
                            {t('footer.description')}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-text-primary font-semibold mb-6">{t('footer.nav_title')}</h4>
                        <ul className="space-y-4">
                            <li><a href="/" className="text-text-secondary hover:text-text-accent transition-colors">{t('nav.home')}</a></li>
                            <li><a href="/#projects" onClick={(e) => handleNav(e, '#projects')} className="text-text-secondary hover:text-text-accent transition-colors">{t('nav.projects')}</a></li>
                            <li><a href="/certificates" className="text-text-secondary hover:text-text-accent transition-colors">{t('nav.certificates')}</a></li>
                            <li><a href="/cv" className="text-text-secondary hover:text-text-accent transition-colors">{t('nav.cv')}</a></li>
                            <li><a href="/activities" className="text-text-secondary hover:text-text-accent transition-colors">{t('nav.activities')}</a></li>
                            <li><a href="/#contact" onClick={(e) => handleNav(e, '#contact')} className="text-text-secondary hover:text-text-accent transition-colors">{t('nav.contact')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-text-primary font-semibold mb-6">{t('footer.contact_title')}</h4>
                        <ul className="space-y-4">
                            <li className="flex items-center space-x-3 text-text-secondary">
                                <Mail size={18} className="text-text-accent" />
                                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-text-primary transition-colors">{CONTACT_INFO.email}</a>
                            </li>
                            <div className="flex items-center space-x-4 pt-2">
                                {SOCIAL_LINKS.map(link => {
                                    const Icon = link.icon === 'github' ? Github : link.icon === 'linkedin' ? Linkedin : null;
                                    if (!Icon) return null;
                                    return (
                                        <a key={link.name} href={link.url} target="_blank" rel="noreferrer" className="p-2 bg-transparent border border rounded-lg text-text-muted hover:text-text-accent hover:border-text-text-accent transition-all">
                                            <Icon size={20} />
                                        </a>
                                    );
                                })}
                            </div>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border flex flex-col md:flex-row justify-center items-center text-sm text-text-muted">
                    <p>© {currentYear} Abdessamad (KAF). {t('footer.rights')}</p>
                    {/* <div className="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" className="hover:text-text-primary transition-colors">{t('footer.privacy')}</a>
                        <a href="#" className="hover:text-text-primary transition-colors">{t('footer.terms')}</a>
                    </div> */}
                </div>
            </Container>
        </footer>
    );
}


