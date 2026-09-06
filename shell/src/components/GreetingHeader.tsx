'use client';

import React, { useEffect, useState } from 'react';
import { Calendar, Sparkles } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';

export const GreetingHeader: React.FC = () => {
  const [greeting, setGreeting] = useState<string>('Welcome back');
  const [formattedDate, setFormattedDate] = useState<string>('');

  useEffect(() => {
    const now = new Date();
    const hour = now.getHours();

    if (hour < 12) {
      setGreeting('Good morning, Priyam');
    } else if (hour < 17) {
      setGreeting('Good afternoon, Priyam');
    } else {
      setGreeting('Good evening, Priyam');
    }

    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    setFormattedDate(now.toLocaleDateString('en-US', options));
  }, []);

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border-light dark:border-border-dark mb-8">
      <div>
        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-1">
          <Sparkles className="w-3.5 h-3.5" />
          <span>SoloOps Command Center</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-textPrimary-light dark:text-textPrimary-dark">
          {greeting}
        </h1>
        <div className="flex items-center gap-2 mt-1 text-sm text-textSecondary-light dark:text-textSecondary-dark">
          <Calendar className="w-4 h-4 text-textMuted-light dark:text-textMuted-dark" />
          <span>{formattedDate || 'Loading date...'}</span>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <ThemeToggle />
      </div>
    </header>
  );
};
