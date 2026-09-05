export const THEME_STORAGE_KEY = 'theme';

export function getSystemTheme() {
    if (typeof window === 'undefined') {
        return 'light';
    }

    return window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light';
}

export function getStoredTheme() {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === 'light' || stored === 'dark' ? stored : null;
}

export function getEffectiveTheme() {
    return getStoredTheme() || getSystemTheme();
}

export function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
}

export function initTheme() {
    applyTheme(getEffectiveTheme());
}
