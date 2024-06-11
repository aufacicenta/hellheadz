import { Html, Head, Main, NextScript } from "next/document";
import Image from "next/image";

import loader from "ui/generic-loader/generic-loader";

export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="icon" href="/favicon.ico" as="image" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/hellheadz/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="/hellheadz/og-image.png" />

        <meta property="og:url" content="https://hellheadz.com/" />

        <style>{loader}</style>
      </Head>
      <body>
        <div id="global-loader">
          <Image src="/hellheadz/lkhh.gif" alt="LKHH" width={184} height={188} />
        </div>

        <Main />

        <NextScript />
      </body>
    </Html>
  );
}
