import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";

import { Navbar } from "ui/fileagent/navbar/Navbar";
import { MainPanel } from "ui/mainpanel/MainPanel";
import { ToastContextController } from "context/toast/ToastContextController";
import { ThemeContextController } from "context/theme/ThemeContextController";
import { EvmWalletSelectorContextController } from "context/evm/wallet-selector/EvmWalletSelectorContextController";
import { Footer } from "ui/footer/Footer";

import { ChatLayoutProps } from "./HomeLayout.types";
import styles from "./HomeLayout.module.scss";

export const HomeLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const { locale } = useRouter();

  return (
    <>
      {process.env.NEXT_PUBLIC_NODE_ENV === "production" && (
        <Script defer src="https://api.pirsch.io/pa.js" id="pianjs" data-code="QUOVXtsuf3gMNfQ5MEqIlHGPmw5aeAt9" />
      )}
      <Head>
        <meta property="og:locale" content={locale} />
      </Head>
      <ThemeContextController>
        <EvmWalletSelectorContextController>
          <ToastContextController>
            <div id="modal-root" />
            <div id="dropdown-portal" />
            <div className={clsx(styles["home-layout"])}>
              <Navbar />

              <MainPanel>{children}</MainPanel>

              <Footer />
            </div>
          </ToastContextController>
        </EvmWalletSelectorContextController>
      </ThemeContextController>
    </>
  );
};
