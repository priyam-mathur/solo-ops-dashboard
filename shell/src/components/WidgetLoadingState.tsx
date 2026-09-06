import React from 'react';

interface WidgetLoadingStateProps {
  title?: string;
}

export const WidgetLoadingState: React.FC<WidgetLoadingStateProps> = ({ title }) => {
  return (
    <div className="h-full w-full min-h-[300px] p-6 rounded-xl border border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark flex flex-col justify-between animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="h-5 w-32 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        <div className="h-4 w-12 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
      </div>
      <div className="space-y-3 flex-1 my-4">
        <div className="h-4 w-full bg-slate-100 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-5/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
        <div className="h-4 w-4/6 bg-slate-100 dark:bg-slate-800 rounded"></div>
        <div className="h-16 w-full bg-slate-100 dark:bg-slate-800 rounded-lg"></div>
      </div>
      <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
        <div className="h-6 w-16 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
      </div>
    </div>
  );
};
