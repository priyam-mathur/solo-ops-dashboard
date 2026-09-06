import React from 'react';
import TodoWidget from '@/components/TodoWidget';

export default function TodoStandalonePage() {
  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark p-8 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="mb-4 text-xs font-semibold text-textMuted-light dark:text-textMuted-dark uppercase tracking-wider text-center">
          Standalone Todo Widget (Port 3002)
        </div>
        <TodoWidget />
      </div>
    </div>
  );
}
