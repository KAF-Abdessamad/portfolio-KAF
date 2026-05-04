import React from 'react';
import { LogoLoop } from '../../components/ui/LogoLoop';
import { 
  SiReact, 
  SiNextdotjs, 
  SiTypescript, 
  SiTailwindcss, 
  SiFigma, 
  SiGithub, 
  SiNodedotjs, 
  SiMongodb 
} from 'react-icons/si';

const techLogos = [
  { node: <SiReact className="tech-icon" size={60} />, title: "React", href: "https://react.dev" },
  { node: <SiNextdotjs className="tech-icon" size={60} />, title: "Next.js", href: "https://nextjs.org" },
  { node: <SiTypescript className="tech-icon" size={60} />, title: "TypeScript", href: "https://www.typescriptlang.org" },
  { node: <SiTailwindcss className="tech-icon" size={60} />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
  { node: <SiFigma className="tech-icon" size={60} />, title: "Figma", href: "https://www.figma.com" },
  { node: <SiGithub className="tech-icon" size={60} />, title: "GitHub", href: "https://github.com" },
  { node: <SiNodedotjs className="tech-icon" size={60} />, title: "Node.js", href: "https://nodejs.org" },
  { node: <SiMongodb className="tech-icon" size={60} />, title: "MongoDB", href: "https://www.mongodb.com" },
];


export default function SkillsMarquee() {
    return (
        <div className="w-full relative px-4 mt-8 flex flex-col items-center">
            {/* We will center the text similar to the user's image inside About.jsx so keeping this pure */}
            <div style={{ height: '90px', position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto' }}>
                {/* Basic horizontal loop */}
                <LogoLoop
                    logos={techLogos}
                    speed={60}
                    direction="left"
                    logoHeight={50}
                    gap={50}
                    hoverSpeed={0}
                    scaleOnHover
                    fadeOut
                    // Letting CSS handle the fadeOutColor based on dark/light mode
                    ariaLabel="Technology partners"
                />
            </div>
        </div>
    );
}
