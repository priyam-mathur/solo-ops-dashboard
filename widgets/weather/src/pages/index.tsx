import React from 'react';
import WeatherWidget from '@/components/WeatherWidget';

export default function WeatherStandalonePage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="mb-4 text-xs font-semibold text-textMuted-light dark:text-textMuted-dark uppercase tracking-wider text-center">
          Standalone Weather Widget (Port 3001)
        </div>
        <WeatherWidget />
      </div>
    </div>
  );
}
