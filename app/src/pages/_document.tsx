import { Html, Head, Main, NextScript } from "next/document";

import loader from "ui/generic-loader/generic-loader";
import { LoadingSpinner } from "ui/icons/LoadingSpinner";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" as="image" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/svpervnder/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/svpervnder/og-image.png" />

        <style>{loader}</style>
      </Head>
      <body>
        <div id="global-loader">
          <LoadingSpinner className="spinner" />
        </div>

        <Main />

        <NextScript />
      </body>
    </Html>
  );
}
