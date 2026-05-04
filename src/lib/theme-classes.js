export const t = {
    // Backgrounds
    bgPage: 'bg-bg-primary',
    bgSection: 'bg-bg-surface',
    bgCard: 'bg-bg-card',
    bgHover: 'hover:bg-bg-elevated',

    // Text — use these, nothing else
    textPrimary: 'text-text-pri',    // main content
    textSecondary: 'text-text-sec',    // subtitles
    textMuted: 'text-text-mut',    // placeholders, captions
    textAccent: 'text-text-acc',    // highlights, links
    textInverse: 'text-text-inv',    // text on colored bg (e.g. primary buttons)

    // Borders
    border: 'border-border-def',
    borderStrong: 'border-border-str',

    // Cards
    card: 'bg-bg-card border border-border-def shadow-theme-sm',
    cardHover: 'hover:shadow-theme-md hover:border-border-str',

    // Buttons
    btnPrimary: `bg-accent hover:bg-accent-h 
               text-text-inv font-semibold 
               rounded-lg px-6 py-2.5`,
    btnSecondary: `bg-transparent border border-border-def 
                 text-text-pri hover:bg-bg-elevated 
                 font-medium rounded-lg px-6 py-2.5 transition-all`,
    btnGhost: `bg-transparent text-text-mut 
             hover:text-text-pri hover:bg-bg-elevated transition-all`,
}
