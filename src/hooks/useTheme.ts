import { useState, useEffect } from 'react';
import { themeStore, ThemeMode } from '../store/themeStore';
import { getThemeColors } from '../constants/Colors';

export function useTheme() {
  const [theme, setTheme] = useState<ThemeMode>(themeStore.getTheme());
  const [colors, setColors] = useState(getThemeColors());

  useEffect(() => {
    // Initialize on first use
    themeStore.initialize().then(() => {
      setTheme(themeStore.getTheme());
      setColors(getThemeColors());
    });

    // Subscribe to changes
    const unsubscribe = themeStore.subscribe(() => {
      setTheme(themeStore.getTheme());
      setColors(getThemeColors());
    });

    return unsubscribe;
  }, []);

  return {
    theme,
    colors,
    isDark: theme === 'dark',
    toggleTheme: themeStore.toggleTheme,
    setTheme: themeStore.setTheme,
  };
}
