import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * useScrollNav
 * Tracks the currently active nav item based on:
 *  - scroll position (for hash-section links on Home)
 *  - pathname (for page-level routes like /certificates, /cv)
 *
 * @param {string[]} sectionIds - ordered list of section IDs to observe on the Home page
 * @returns {{ activeSection: string }} - the active href string (e.g. '#projects', '/certificates')
 */
export function useScrollNav(sectionIds = []) {
    const { pathname } = useLocation();
    const [activeSection, setActiveSection] = useState('');

    // When not on home page, the pathname IS the active item
    // When on home page, watch IntersectionObserver for sections
    useEffect(() => {
        if (pathname !== '/') {
            setActiveSection(pathname);
            return;
        }

        // Reset to hero when landing on home
        setActiveSection('#hero');

        if (!sectionIds.length) return;

        const observers = [];
        const visibilityMap = {};

        const updateActive = () => {
            // Pick the first section that is in view (top-most)
            for (const id of sectionIds) {
                if (visibilityMap[id]) {
                    setActiveSection(`#${id}`);
                    return;
                }
            }
        };

        sectionIds.forEach((id) => {
            const el = document.getElementById(id);
            if (!el) return;

            visibilityMap[id] = false;

            const observer = new IntersectionObserver(
                ([entry]) => {
                    visibilityMap[id] = entry.isIntersecting;
                    updateActive();
                },
                { rootMargin: '-20% 0px -60% 0px', threshold: 0 }
            );

            observer.observe(el);
            observers.push(observer);
        });

        return () => {
            observers.forEach((o) => o.disconnect());
        };
    }, [pathname, sectionIds.join(',')]); // eslint-disable-line react-hooks/exhaustive-deps

    return { activeSection };
}
