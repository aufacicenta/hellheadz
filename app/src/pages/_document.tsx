import { Html, Head, Main, NextScript } from "next/document";

import loader from "ui/generic-loader/generic-loader";
import { AufacicentaIcon } from "ui/icons/AufacicentaIcon";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" as="image" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/aufacicenta/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/aufacicenta/og-image.png" />

        <meta property="og:url" content="https://aufacicenta.com/" />

        <style>{loader}</style>
      </Head>
      <body>
        <div id="global-loader">
          <AufacicentaIcon className="logo" />
        </div>

        <Main />

        <NextScript />
      </body>
    </Html>
  );
}
