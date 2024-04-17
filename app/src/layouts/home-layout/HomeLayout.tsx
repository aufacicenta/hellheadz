import clsx from "clsx";
import Head from "next/head";
import { useRouter } from "next/router";

import { Navbar } from "ui/fileagent/navbar/Navbar";
import { MainPanel } from "ui/mainpanel/MainPanel";
import { ToastContextController } from "context/toast/ToastContextController";
import { ThemeContextController } from "context/theme/ThemeContextController";
import { EvmWalletSelectorContextController } from "context/evm/wallet-selector/EvmWalletSelectorContextController";

import { ChatLayoutProps } from "./HomeLayout.types";
import styles from "./HomeLayout.module.scss";

export const HomeLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const { locale } = useRouter();

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.ico" as="image" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <meta property="og:image" content="/shared/pulse.png" />
        <meta property="og:type" content="website" />
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
            </div>
          </ToastContextController>
        </EvmWalletSelectorContextController>
      </ThemeContextController>
    </>
  );
};
