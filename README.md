# Portfolio Ingénieur 3D Interactif 🚀

Un portfolio professionnel moderne, performant et immersif, conçu pour mettre en valeur des compétences d'ingénierie Full Stack avec des technologies web avancées.

Ce projet se distingue par son design system premium, ses animations fluides et sa scène 3D interactive, offrant une expérience utilisateur (UX) de haut niveau.

## ✨ Fonctionnalités Clés

*   **Hero Section 3D Immersive :** Un "Tech Cube" interactif en Three.js avec effet de parallaxe au mouvement de la souris, éclairage dynamique et particules flottantes.
*   **Design System Premium :** Une interface basée sur le glassmorphism (cartes translucides, flous d'arrière-plan), avec une palette de couleurs soignée (Primary `#0A0A0A`, Secondary `#1A1A1A`, Accent `#3B82F6`).
*   **Animations Fluides :** Combinaison de GSAP (GreenSock) pour des apparitions séquentielles (stagger) et de Framer Motion pour les interactions d'interface (survols, fenêtres modales, onglets dynamiques).
*   **Typographie Dynamique :** Effet de "machine à écrire" personnalisé (`useTypewriter`) et sous-titres cycliques animés.
*   **Galerie de Projets Interactive :** Un système de filtrage performant (Web, Mobile, 3D, Design) avec des cartes de projets interactives et des modales détaillées (technologies, défis techniques, galerie d'images).
*   **Timeline d'Expériences :** Un parcours professionnel présenté sous forme de frise chronologique verticale animée au défilement.
*   **Entièrement Responsive :** Une conception "Mobile-first" garantissant une expérience optimale sur les smartphones, tablettes et ordinateurs de bureau (avec déclinaison intelligente de la 3D sur mobile).

## 🛠️ Pile Technologique (Tech Stack)

### Coeur & Architecture
*   **[React](https://react.dev/) (v19) :** Bibliothèque UI basée sur les composants.
*   **[Vite](https://vitejs.dev/) :** Outil de build ultra-rapide et serveur de développement.
*   **[React Router DOM](https://reactrouter.com/) :** Gestion de la navigation et du routage de l'application.

### Visuel & Styling
*   **[Tailwind CSS](https://tailwindcss.com/) (v3) :** Framework CSS utilitaire pour un design rapide et cohérent.
*   **[Lucide React](https://lucide.dev/) :** Bibliothèque d'icônes SVG nettes et modernes.
*   **[clsx](https://github.com/lukeed/clsx) & [tailwind-merge](https://github.com/dcastil/tailwind-merge) :** Utilitaires pour la composition conditionnelle et sécurisée des classes Tailwind.

### Animations & 3D
*   **[Three.js](https://threejs.org/) :** Moteur 3D WebGL de référence.
*   **[React Three Fiber](https://docs.pmnd.rs/react-three-fiber/) (@react-three/fiber) :** Intégration déclarative de Three.js dans l'écosystème React.
*   **[Drei](https://github.com/pmndrs/drei) (@react-three/drei) :** Helpers utiles pour R3F (Étoiles, Flottaison, Distorsion de maillage, etc.).
*   **[Framer Motion](https://www.framer.com/motion/) :** Bibliothèque d'animation déclarative pour les composants React.
*   **[GSAP](https://gsap.com/) :** Bibliothèque d'animation JavaScript robuste pour les séquences asynchrones complexes.

## 📁 Architecture du Code

Le projet est organisé selon une architecture modulaire et scalable :

```
portfolio-KAF/
├── public/                 # Assets statiques (modèles, textures, favicons)
├── src/
│   ├── assets/             # Images, polices locales
│   ├── components/         # Composants réutilisables
│   │   ├── 3d/             # Scènes et objets Three.js (ex: HeroScene.jsx)
│   │   ├── layout/         # Éléments de structure (Header, Footer, Container, Section)
│   │   └── ui/             # Design System (Button, Card, Modal, Input, Badge, Tabs)
│   ├── constants/          # Données de l'application (projects.js, experiences.js)
│   ├── hooks/              # Hooks React personnalisés (ex: useTypewriter.js)
│   ├── sections/           # Vues principales de l'application (Hero, Projects, Experience)
│   ├── App.jsx             # Point d'entrée de l'application et définition du routage
│   ├── main.jsx            # Point de montage React
│   └── index.css           # Configuration globale CSS et directives Tailwind
├── postcss.config.js       # Configuration des plugins PostCSS (Autoprefixer, Tailwind)
├── tailwind.config.js      # Configuration du thème Tailwind, palettes de couleurs personnalisées
└── vite.config.js          # Paramétrage de Vite
```

## 🚀 Démarrage Rapide

### Prérequis
*   [Node.js](https://nodejs.org/) (version 18+ recommandée)
*   [npm](https://www.npmjs.com/) (ou yarn, pnpm)

### Installation

1.  **Cloner le dépôt :**
    ```bash
    git clone https://github.com/KAF-Abdessamad/portfolio-KAF.git
    cd portfolio-KAF
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    # ou yarn install / pnpm install
    ```

3.  **Lancer le serveur de développement :**
    ```bash
    npm run dev
    ```
    L'application sera accessible sur `http://localhost:5173`.

### Compilation pour la Production

Pour créer une version optimisée prête pour le déploiement :
```bash
npm run build
```
Les fichiers générés se trouveront dans le dossier `dist/`. Vous pouvez prévisualiser le build de production avec :
```bash
npm run preview
```

## 🎨 Personnalisation

*   **Données :** Modifiez les fichiers `src/constants/projects.js` et `src/constants/experiences.js` pour y insérer votre propre contenu professionnel.
*   **Couleurs :** Le thème global est défini dans `tailwind.config.js` sous `theme.extend.colors`. Modifiez les objets `primary`, `secondary` et `accent` pour changer toute l'apparence du site.
*   **Composants 3D :** Ajustez les couleurs, les vitesses de rotation et l'éclairage directement dans `src/components/3d/HeroScene.jsx`.

---
*Créé avec ❤️ en combinant la puissance de React et la beauté de WebGL.*
