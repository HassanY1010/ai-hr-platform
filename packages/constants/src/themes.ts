export const THEMES = {
    LIGHT: 'light',
    DARK: 'dark',
    SYSTEM: 'system',
} as const;

export const DEFAULT_THEME = THEMES.SYSTEM;

export const COLORS = {
    PRIMARY: '#3b82f6',
    SECONDARY: '#64748b',
    SUCCESS: '#22c55e',
    DANGER: '#ef4444',
    WARNING: '#f59e0b',
    INFO: '#06b6d4',
} as const;
