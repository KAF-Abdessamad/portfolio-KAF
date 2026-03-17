import * as DevIcons from 'devicons-react';

/**
 * Mapping of common icon keys to their brand colors.
 * These act as defaults if not provided by the database.
 */
export const ICON_CONFIG = {
    "react": { component: DevIcons.DiReact, color: "#61DAFB" },
    "python": { component: DevIcons.DiPython, color: "#3776AB" },
    "javascript": { component: DevIcons.DiJavascript1, color: "#F7DF1E" },
    "typescript": { component: DevIcons.DiScriptcs, color: "#3178C6" }, // Approximation if Si not in DevIcons
    "nodejs": { component: DevIcons.DiNodejs, color: "#339933" },
    "mongodb": { component: DevIcons.DiMongodb, color: "#47A248" },
    "postgresql": { component: DevIcons.DiPostgresql, color: "#336791" },
    "docker": { component: DevIcons.DiDocker, color: "#2496ED" },
    "git": { component: DevIcons.DiGit, color: "#F05032" },
    "threejs": { component: DevIcons.DiCodepen, color: "#FFFFFF" }, // Placeholder
    "tailwind": { component: DevIcons.DiCss3, color: "#06B6D4" }, // Placeholder
    "supabase": { component: DevIcons.DiDatabase, color: "#3ECF8E" }, // Placeholder
};

/**
 * Helper to get the icon component or a fallback
 * @param {string} key 
 */
export const getIcon = (key) => {
    if (!key) return null;

    const lowerKey = key.toLowerCase();

    // Check our manual mapping first
    if (ICON_CONFIG[lowerKey]) {
        return ICON_CONFIG[lowerKey].component;
    }

    // Try to find it dynamically in DevIcons (e.g., "react" -> "DiReact")
    const dynamicKey = "Di" + lowerKey.charAt(0).toUpperCase() + lowerKey.slice(1);
    if (DevIcons[dynamicKey]) {
        return DevIcons[dynamicKey];
    }

    return null;
};

/**
 * Helper to get the brand color or a fallback
 * @param {string} key 
 * @param {string} dbColor - Optional color from DB
 */
export const getBrandColor = (key, dbColor) => {
    if (dbColor) return dbColor;

    const lowerKey = key?.toLowerCase();
    if (ICON_CONFIG[lowerKey]) {
        return ICON_CONFIG[lowerKey].color;
    }

    return "#666666"; // Default gray
};
