import React, { useEffect, useRef } from 'react';
import { GreetingHeader } from '@/components/GreetingHeader';
import { WidgetErrorBoundary } from '@/components/WidgetErrorBoundary';

interface ZoneFrameProps {
  src: string;
  title: string;
  id: string;
}

function ZoneFrame({ src, title, id }: ZoneFrameProps) {
  const frameRef = useRef<HTMLIFrameElement>(null);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== 'soloops.theme' || !frameRef.current?.contentWindow) return;
      frameRef.current.contentWindow.postMessage(
        { type: 'soloops:themechange', theme: e.newValue ?? 'light' },
        '*'
      );
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <iframe
      ref={frameRef}
      src={src}
      title={title}
      id={id}
      className="w-full h-full rounded-xl border-0"
      style={{ minHeight: '420px' }}
      loading="lazy"
    />
  );
}

export default function HomePage() {
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-screen">
      <GreetingHeader />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        <section className="h-full min-h-[420px]" id="slot-weather">
          <WidgetErrorBoundary widgetName="Weather">
            <ZoneFrame src="/weather" title="Weather Widget" id="frame-weather" />
          </WidgetErrorBoundary>
        </section>

        <section className="h-full min-h-[420px]" id="slot-todo">
          <WidgetErrorBoundary widgetName="Todo">
            <ZoneFrame src="/todo" title="Todo Widget" id="frame-todo" />
          </WidgetErrorBoundary>
        </section>

        <section className="h-full min-h-[420px]" id="slot-notes">
          <WidgetErrorBoundary widgetName="Notes">
            <ZoneFrame src="/notes" title="Notes Widget" id="frame-notes" />
          </WidgetErrorBoundary>
        </section>

        <section className="h-full min-h-[420px]" id="slot-analytics">
          <WidgetErrorBoundary widgetName="Analytics">
            <ZoneFrame src="/analytics" title="Analytics Widget" id="frame-analytics" />
          </WidgetErrorBoundary>
        </section>
      </div>
    </main>
  );
}
