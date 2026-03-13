'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type Theme = 'light' | 'dark' | 'sakura' | 'matcha' | 'starry';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const themeKeys: Theme[] = ['light', 'dark', 'sakura', 'matcha', 'starry'];

function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light';
  const saved = localStorage.getItem('theme');
  if (saved && themeKeys.includes(saved as Theme)) return saved as Theme;
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
  return 'light';
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;

    // Clear previous theme-related classes
    root.classList.remove('light', 'dark', 'theme-sakura', 'theme-matcha', 'theme-starry');

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
  }, [theme]);

  const toggleTheme = () => {
    setThemeState((prev) => {
      const isCurrentlyDark = prev === 'dark' || prev === 'starry';
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
