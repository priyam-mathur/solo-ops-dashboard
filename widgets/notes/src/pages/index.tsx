import dynamic from 'next/dynamic';
import Head from 'next/head';

const NotesWidget = dynamic(() => import('../components/NotesWidget'), { ssr: false });

export default function NotesPage() {
  return (
    <>
      <Head>
        <title>Notes Widget — SoloOps</title>
        <meta name="description" content="Client notes widget for SoloOps dashboard" />
      </Head>
      <div className="min-h-screen p-4 bg-background-light dark:bg-background-dark">
        <NotesWidget />
      </div>
    </>
  );
}
