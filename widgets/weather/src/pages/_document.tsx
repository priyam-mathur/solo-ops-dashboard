import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  return (
    <Html lang="en">
      <Head />
      <body className="bg-background-light dark:bg-background-dark text-textPrimary-light dark:text-textPrimary-dark min-h-screen transition-colors duration-200">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
