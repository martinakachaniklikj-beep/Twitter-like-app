'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme =
  | 'light'
  | 'dark'
  | 'sakura'
  | 'matcha'
  | 'starry';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as Theme | null;

    if (savedTheme) {
      setThemeState(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setThemeState('dark');
    } else {
      setThemeState('light');
    }

    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const root = document.documentElement;

    // Clear previous theme-related classes
    root.classList.remove(
      'light',
      'dark',
      'theme-sakura',
      'theme-matcha',
      'theme-starry',
    );

    // Derive base color mode (light / dark) from selected theme
    const isDarkLike = theme === 'dark' || theme === 'starry';
    const baseMode = isDarkLike ? 'dark' : 'light';

    root.classList.add(baseMode);

    // Add palette-specific class for non-default themes
    if (theme === 'sakura') {
      root.classList.add('theme-sakura');
    } else if (theme === 'matcha') {
      root.classList.add('theme-matcha');
    } else if (theme === 'starry') {
      root.classList.add('theme-starry');
    }

    localStorage.setItem('theme', theme);
  }, [theme, mounted]);

  const toggleTheme = () => {
    setThemeState((prev) => {
      const isCurrentlyDark =
        prev === 'dark' || prev === 'starry';
      return isCurrentlyDark ? 'light' : 'dark';
    });
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
