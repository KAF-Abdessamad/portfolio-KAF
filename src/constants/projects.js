export const projects = [
    {
        id: 1,
        title: "EcoSphere Dashboard",
        description: "Plateforme de gestion d'énergie intelligente avec monitoring en temps réel.",
        fullDescription: "Une solution SaaS complète permettant aux entreprises de suivre et d'optimiser leur consommation énergétique grâce à des capteurs IoT et une analyse prédictive.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800",
        category: "Web",
        featured: true,
        technologies: ["React", "Node.js", "D3.js", "PostgreSQL"],
        github: "https://github.com",
        demo: "https://demo.com",
        gallery: [
            "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
            "https://images.unsplash.com/photo-1543286386-713bcd51403b?auto=format&fit=crop&q=80&w=800"
        ],
        challenges: [
            "Gestion de gros volumes de données en temps réel",
            "Création de visualisations complexes avec D3.js",
            "Optimisation des requêtes SQL"
        ]
    },
    {
        id: 2,
        title: "Nova 3D Configurator",
        description: "Configurateur de produits 3D interactif pour l'industrie automobile.",
        fullDescription: "Application permettant aux utilisateurs de personnaliser leur véhicule en temps réel (couleur, jantes, intérieur) avec un rendu photoréaliste.",
        image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=800",
        category: "3D",
        featured: true,
        technologies: ["Three.js", "React Three Fiber", "GSAP"],
        github: "https://github.com",
        demo: "https://demo.com",
        gallery: [
            "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800"
        ],
        challenges: [
            "Optimisation des modèles GLTF",
            "Gestion des textures et éclairages dynamiques",
            "Transitions fluides entre les états de configuration"
        ]
    },
    {
        id: 3,
        title: "Lumina Mobile",
        description: "Application de bien-être utilisant l'IA pour le suivi du sommeil.",
        fullDescription: "Une application mobile élégante qui analyse les cycles de sommeil et propose des conseils personnalisés pour améliorer le repos.",
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
        category: "Mobile",
        featured: false,
        technologies: ["React Native", "Firebase", "TensorFlow Lite"],
        github: "https://github.com",
        demo: "https://demo.com",
        gallery: [],
        challenges: [
            "Intégration de modèles IA en local (on-device)",
            "Gestion de la synchronisation hors-ligne",
            "Design d'interface minimaliste et apaisant"
        ]
    },
    {
        id: 4,
        title: "CyberPulse Security",
        description: "Dashboard de cybersécurité pour la détection d'intrusions.",
        fullDescription: "Interface de monitoring réseau permettant de visualiser les menaces en temps réel et d'automatiser les réponses aux incidents.",
        image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800",
        category: "Web",
        featured: false,
        technologies: ["Vue.js", "Python", "Docker", "ELK Stack"],
        github: "https://github.com",
        demo: "https://demo.com",
        gallery: [],
        challenges: [
            "Visualisation de graphes de menaces complexes",
            "Agrégation de logs provenant de sources disparates",
            "Temps de réponse minimal pour les alertes critiques"
        ]
    },
    {
        id: 5,
        title: "Aura Design System",
        description: "Bibliothèque de composants UI/UX premium pour les applications tech.",
        fullDescription: "Un système de design complet incluant des composants accessibles, un guide de style et des générateurs de tokens.",
        image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&q=80&w=800",
        category: "Design",
        featured: false,
        technologies: ["Figma", "Storybook", "Tailwind CSS"],
        github: "https://github.com",
        demo: "https://demo.com",
        gallery: [],
        challenges: [
            "Mise en conformité WCAG 2.1",
            "Documentation complète et interactive",
            "Architecture CSS modulable et évolutive"
        ]
    },
    {
        id: 6,
        title: "Nexus Metaverse",
        description: "Espace virtuel social immersif pour les galeries d'art numériques.",
        fullDescription: "Un monde 3D persistant où les utilisateurs peuvent explorer des galeries d'exposition NFT et interagir en direct.",
        image: "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&q=80&w=800",
        category: "3D",
        featured: true,
        technologies: ["React Three Fiber", "Socket.io", "Rapier"],
        github: "https://github.com",
        demo: "https://demo.com",
        gallery: [],
        challenges: [
            "Multiplayer temps réel avec Socket.io",
            "Moteur de physique optimisé pour le Web",
            "Optimisation du chargement des assets volumineux"
        ]
    },
    {
        id: 7,
        title: "Flow State Tasker",
        description: "Gestionnaire de tâches minimaliste axé sur la productivité profonde.",
        fullDescription: "Application web qui utilise la technique Pomodoro et des sons d'ambiance pour aider à atteindre l'état de 'Flow'.",
        image: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800",
        category: "Web",
        featured: false,
        technologies: ["Next.js", "Prisma", "PWA"],
        github: "https://github.com",
        demo: "https://demo.com",
        gallery: [],
        challenges: [
            "Expérience utilisateur ultra-fluide (0 latence)",
            "Mode offline complet grâce au Service Worker",
            "Système de notifications cross-platform"
        ]
    },
    {
        id: 8,
        title: "Vortex Trading",
        description: "Analyseur de marché crypto avec algorithmes de détection de tendance.",
        fullDescription: "Outil d'analyse technique automatisé scannant des centaines de paires pour identifier les opportunités de trading.",
        image: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=800",
        category: "Web",
        featured: false,
        technologies: ["React", "Go", "Redis", "WebSocket"],
        github: "https://github.com",
        demo: "https://demo.com",
        gallery: [],
        challenges: [
            "Haute disponibilité et scalabilité du backend Go",
            "Gestion des flux WebSocket à haute fréquence",
            "Implémentation d'algorithmes mathématiques complexes"
        ]
    },
    {
        id: 9,
        title: "Zenith UI Kit",
        description: "Framework CSS utilitaire pour des interfaces néomorphiques.",
        fullDescription: "Une collection de classes et de variables CSS pour créer des interfaces au style néomorphique moderne et accessible.",
        image: "https://images.unsplash.com/photo-1558655146-d09347e92766?auto=format&fit=crop&q=80&w=800",
        category: "Design",
        featured: false,
        technologies: ["Sass", "PostCSS", "Eleventy"],
        github: "https://github.com",
        demo: "https://demo.com",
        gallery: [],
        challenges: [
            "Équilibre entre contraste et esthétique néomorphique",
            "Poids du framework optimisé",
            "Compatibilité navigateurs anciens via PostCSS"
        ]
    }
];
