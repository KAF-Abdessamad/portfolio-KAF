# Skill UI/UX pour Antigravity — Installation

## Le fichier à donner
`ui-ux-developer/SKILL.md` — c'est la skill complète (en anglais, c'est le format que les agents lisent le mieux ; elle impose à Antigravity : tokens d'abord, tous les états des composants, accessibilité, responsive vérifié en 3 largeurs, et interdiction du look « template IA générique »).

## Où la placer (Windows)

**Option A — pour un seul projet (recommandé pour tester) :**
Dans le dossier de ton projet, crée ce chemin et mets-y le dossier `ui-ux-developer` entier :
```
<ton-projet>\.antigravity\skills\ui-ux-developer\SKILL.md
```
Exemple pour ton portfolio :
```
C:\Users\kafab\Desktop\les projets\portfolio-KAF\.antigravity\skills\ui-ux-developer\SKILL.md
```

**Option B — pour tous tes projets (globale) :**
```
C:\Users\kafab\.gemini\antigravity\skills\ui-ux-developer\SKILL.md
```

> Si ton Antigravity utilise un autre nom de dossier (`.agent\skills` selon les versions), ouvre Antigravity → Settings → cherche « Skills » : le chemin attendu y est indiqué. Le contenu du SKILL.md reste le même.

## Comment l'utiliser
Redémarre Antigravity (ou rouvre le projet), puis demande normalement, par exemple :
> « En utilisant la skill ui-ux-developer, refais la section Projets de mon portfolio »

L'agent doit alors : lire ton projet, annoncer un mini plan design (palette, polices, composants) AVANT de coder, puis vérifier le rendu en 375 / 768 / 1280 px. S'il code directement sans plan, rappelle-lui : « applique la skill ui-ux-developer ».

## Plan B — si les skills ne s'activent pas
Colle tout le contenu de SKILL.md (sans le bloc `---` du haut) dans les **Rules / Custom Instructions** du projet dans Antigravity. Effet presque identique.
