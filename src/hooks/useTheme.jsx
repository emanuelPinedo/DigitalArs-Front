import { useState } from 'react';
import {
    applyTheme,
    getEffectiveTheme,
    THEME_STORAGE_KEY,
} from '../utils/theme';

function useTheme() {
    const [theme, setTheme] = useState(getEffectiveTheme);

    const toggleTheme = () => {
        const nextTheme = theme === 'dark' ? 'light' : 'dark';
        localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
        applyTheme(nextTheme);
        setTheme(nextTheme);
    };

    return { theme, toggleTheme };
}

export default useTheme;
