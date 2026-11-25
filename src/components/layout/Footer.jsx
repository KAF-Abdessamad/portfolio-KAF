import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from './Container';
import { Github, Linkedin, Mail } from 'lucide-react';
import { CONTACT_INFO, SOCIAL_LINKS } from '../../lib/constants/contact';
import { useTranslation } from 'react-i18next';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export default function Footer() {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { settings, getLocalizedValue } = useSiteSettings();
    const lang = i18n.resolvedLanguage || i18n.language || 'fr';
    const currentYear = new Date().getFullYear();

    const fullName = settings.profile?.fullName || 'Abdessamad (KAF)';
    const email = settings.profile?.email || CONTACT_INFO.email;
    const footerBio = getLocalizedValue(settings.profile, 'footerBio', lang, t('footer.description'));
    const socialLinks = [
        { name: 'GitHub', url: settings.profile?.githubUrl || SOCIAL_LINKS[0].url, icon: 'github' },
        { name: 'LinkedIn', url: settings.profile?.linkedinUrl || SOCIAL_LINKS[1].url, icon: 'linkedin' },
    ].filter(l => Boolean(l.url));

    const handleNav = (e, link) => {
        if (link.startsWith('#')) {
            e.preventDefault();
            const element = document.getElementById(link.substring(1));
            if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } else {
                navigate('/');
                setTimeout(() => {
                    document.getElementById(link.substring(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 400);
            }
        }
    };

    return (
        <footer className="bg-bg-surface border-t border-border-def py-12">
            <Container>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 mb-12">
                    <div className="col-span-1 sm:col-span-2 lg:col-span-2">
                        <div className="text-2xl font-bold text-text-pri mb-4 tracking-tighter">
                            KAF<span className="text-text-acc">.</span>
                        </div>
                        <p className="text-text-sec text-sm sm:text-base max-w-sm leading-relaxed">
                            {footerBio}
                        </p>
                    </div>

                    <div>
                        <h4 className="text-text-pri font-semibold mb-4 sm:mb-6">{t('footer.nav_title')}</h4>
                        <ul className="space-y-3 sm:space-y-4 text-sm">
                            <li><Link to="/" className="text-text-sec hover:text-text-acc transition-colors">{t('nav.home')}</Link></li>
                            <li><a href="/#projects" onClick={(e) => handleNav(e, '#projects')} className="text-text-sec hover:text-text-acc transition-colors">{t('nav.projects')}</a></li>
                            <li><Link to="/certificates" className="text-text-sec hover:text-text-acc transition-colors">{t('nav.certificates')}</Link></li>
                            <li><Link to="/cv" className="text-text-sec hover:text-text-acc transition-colors">{t('nav.cv')}</Link></li>
                            <li><Link to="/activities" className="text-text-sec hover:text-text-acc transition-colors">{t('nav.activities')}</Link></li>
                            <li><a href="/#contact" onClick={(e) => handleNav(e, '#contact')} className="text-text-sec hover:text-text-acc transition-colors">{t('nav.contact')}</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-text-pri font-semibold mb-4 sm:mb-6">{t('footer.contact_title')}</h4>
                        <ul className="space-y-3 sm:space-y-4 text-sm">
                            <li className="flex items-start sm:items-center space-x-2.5 text-text-sec overflow-hidden">
                                <Mail size={16} className="text-text-acc shrink-0 mt-1 sm:mt-0" />
                                <a
                                    href={`mailto:${email}`}
                                    className="hover:text-text-pri transition-colors break-all text-xs sm:text-sm font-mono tracking-tight"
                                >
                                    {email}
                                </a>
                            </li>
                            {settings.appearance?.showSocialLinks !== false && (
                                <div className="flex items-center space-x-3 pt-2">
                                    {socialLinks.map(link => {
                                        const Icon = link.icon === 'github' ? Github : link.icon === 'linkedin' ? Linkedin : null;
                                        if (!Icon) return null;
                                        return (
                                            <a key={link.name} href={link.url} target="_blank" rel="noreferrer" className="p-2 bg-transparent border border-border-def rounded-lg text-text-mut hover:text-text-acc hover:border-accent transition-all">
                                                <Icon size={18} />
                                            </a>
                                        );
                                    })}
                                </div>
                            )}
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-border-def flex flex-col md:flex-row justify-center items-center text-sm text-text-mut">
                    <p>© {currentYear} {fullName}. {t('footer.rights')}</p>
                </div>
            </Container>
        </footer>
    );
}
