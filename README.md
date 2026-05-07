# Portfolio Ingénieur Logiciel & Full Stack 🚀

Un portfolio professionnel moderne, performant et immersif, conçu pour mettre en valeur des compétences d'ingénierie logicielle avec des technologies web de pointe. Ce projet combine une interface premium, une expérience utilisateur (UX) fluide et une intelligence artificielle intégrée.

## ✨ Fonctionnalités Clés

*   **Assistant IA Intelligent :** Chatbot intégré propulsé par **OpenAI (GPT-3.5)** capable de répondre aux questions sur le parcours, les compétences et les projets. Inclut un système de fallback local intelligent.
*   **Multilingue (i18next) :** Support complet du **Français** et de l'**Anglais** avec détection automatique de la langue et changement instantané.
*   **Design System Premium :** Interface basée sur le glassmorphism, avec un **mode sombre/clair** dynamique et une palette de couleurs harmonieuse.
*   **Backend Dynamique (Supabase) :** Gestion en temps réel des projets, certificats, activités parascolaires et messages via une base de données PostgreSQL.
*   **Système de CV Interactif :** Page dédiée pour visualiser le CV et bouton "DOWNLOAD CV" optimisé pour le téléchargement direct.
*   **Animations Avancées :** Utilisation de **Framer Motion** pour les interactions fluides (modales, onglets, transitions).
*   **Entièrement Responsive :** Optimisation "Mobile-first" rigoureuse avec une attention particulière à l'alignement des contrôles et à la lisibilité des informations.

## 🛠️ Pile Technologique (Tech Stack)

### Frontend & Frameworks
*   **[React](https://react.dev/) (v19) :** Architecture basée sur les composants.
*   **[Vite](https://vitejs.dev/) :** Environnement de développement ultra-rapide.
*   **[Tailwind CSS](https://tailwindcss.com/) :** Design system utilitaire et responsive.
*   **[React Router](https://reactrouter.com/) :** Gestion fluide de la navigation.
*   **[i18next](https://www.i18next.com/) :** Internationalisation (FR/EN).

### Backend & Services
*   **[Supabase](https://supabase.com/) :** Base de données PostgreSQL, authentification et stockage.
*   **[OpenAI API](https://openai.com/) :** Intelligence artificielle pour l'assistant virtuel.
*   **[EmailJS](https://www.emailjs.com/) :** Service d'envoi de formulaires de contact sans backend.

### Animations
*   **[Framer Motion](https://www.framer.com/motion/) :** Transitions et micro-interactions fluides.

## 📁 Architecture du Projet

```
portfolio-KAF/
├── src/
│   ├── components/         # Composants réutilisables
│   │   ├── common/         # Éléments partagés (ThemeToggle, LanguageSwitcher)
│   │   ├── layout/         # Header, Footer, Container
│   │   └── ui/             # Composants Design System (Chatbot, ProjectCard, Button)
│   ├── context/            # Gestion du Thème et des données globales
│   ├── hooks/              # Logique réutilisable (useCV, useActivities, useOpenAI)
│   ├── lib/                # Configuration Supabase, EmailJS, i18n
│   ├── pages/              # Vues principales (Home, CV, Certificates, Admin)
│   ├── sections/           # Blocs de contenu (Hero, Projects, Contact, About)
│   └── translations/       # Fichiers JSON de traduction (fr.json, en.json)
├── supabase/               # Scripts SQL et configuration de la base de données
└── .env                    # Variables d'environnement (Clés API)
```

## 🚀 Démarrage Rapide

### Prérequis
*   Node.js (18+)
*   Un compte Supabase (pour la base de données)
*   Une clé API OpenAI (pour le chatbot)

### Installation

1.  **Cloner le projet :**
    ```bash
    git clone https://github.com/KAF-Abdessamad/portfolio-KAF.git
    cd portfolio-KAF
    ```

2.  **Installer les dépendances :**
    ```bash
    npm install
    ```

3.  **Configurer les variables d'environnement :**
    Créez un fichier `.env` à la racine et ajoutez vos clés :
    ```env
    VITE_SUPABASE_URL=votre_url
    VITE_SUPABASE_ANON_KEY=votre_cle_anon
    VITE_OPENAI_API_KEY=votre_cle_openai
    VITE_EMAILJS_SERVICE_ID=...
    VITE_EMAILJS_TEMPLATE_ID=...
    VITE_EMAILJS_PUBLIC_KEY=...
    ```

4.  **Lancer le serveur :**
    ```bash
    npm run dev
    ```

## 🎨 Déploiement

Le projet est configuré pour un déploiement facile sur **Vercel** ou **Netlify**.
- Les variables d'environnement doivent être ajoutées dans les paramètres de votre plateforme de déploiement (Dashboard Vercel -> Settings -> Environment Variables).

---
*Développé avec passion par **Abdessamad KAF**. Alliant technique, design et innovation.*
