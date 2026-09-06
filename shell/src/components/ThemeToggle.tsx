'use client';

import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';

export const ThemeToggle: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const saved = localStorage.getItem('soloops.theme') as 'light' | 'dark' | null;
    const initialTheme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initialTheme);
    applyTheme(initialTheme);
  }, []);

  const applyTheme = (newTheme: 'light' | 'dark') => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('soloops.theme', newTheme);
    window.dispatchEvent(
      new CustomEvent('soloops:themechange', {
        detail: { theme: newTheme }
      })
    );
  };

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    applyTheme(next);
  };

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle display theme"
      className="p-2 rounded-lg border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark text-textSecondary-light dark:text-textSecondary-dark hover:bg-surfaceHover-light dark:hover:bg-surfaceHover-dark transition-colors shadow-sm"
    >
      {theme === 'light' ? <Moon className="w-5 h-5 text-slate-700" /> : <Sun className="w-5 h-5 text-amber-400" />}
    </button>
  );
};
