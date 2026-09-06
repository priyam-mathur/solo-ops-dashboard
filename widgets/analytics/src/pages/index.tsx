import dynamic from 'next/dynamic';
import Head from 'next/head';

const AnalyticsWidget = dynamic(() => import('../components/AnalyticsWidget'), { ssr: false });

export default function AnalyticsPage() {
  return (
    <>
      <Head>
        <title>Analytics Widget — SoloOps</title>
        <meta name="description" content="Revenue analytics widget for SoloOps dashboard" />
      </Head>
      <div className="min-h-screen p-4 bg-background-light dark:bg-background-dark">
        <AnalyticsWidget />
      </div>
    </>
  );
}
