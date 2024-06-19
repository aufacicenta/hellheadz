import clsx from "clsx";
import anime from "animejs";
import Head from "next/head";
import { useRouter } from "next/router";
import Script from "next/script";
import { useEffect } from "react";

import { Navbar } from "ui/fileagent/navbar/Navbar";
import { MainPanel } from "ui/mainpanel/MainPanel";
import { ToastContextController } from "context/toast/ToastContextController";
import { ThemeContextController } from "context/theme/ThemeContextController";
import { EvmWalletSelectorContextController } from "context/evm/wallet-selector/EvmWalletSelectorContextController";
import { Footer } from "ui/footer/Footer";
import { AuthorizationContextController } from "context/authorization/AuthorizationContextController";
import { DiscordContextController } from "context/discord/DiscordContextController";
import { AnalyticsContextController } from "context/analytics/AnalyticsContextController";

import { ChatLayoutProps } from "./HomeLayout.types";
import styles from "./HomeLayout.module.scss";

export const HomeLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  const { locale } = useRouter();

  useEffect(() => {
    anime
      .timeline({
        easing: "easeInOutSine",
        duration: 1500,
        delay: (_el, i) => i * 250,
        direction: "alternate",
        loop: true,
      })
      .add({
        targets: ".logo path",
        strokeDashoffset: [0, anime.setDashoffset],
        fill: ["transparent", "#4a4b6c"],
      });

    anime({
      targets: ".logo ellipse",
      translateX: ["0", "23px"],
      easing: "easeInOutSine",
      duration: 1500,
      direction: "alternate",
      loop: true,
    });
  }, []);

  return (
    <>
      {process.env.NEXT_PUBLIC_VERCEL_ENV === "production" && (
        <Script
          defer
          src="https://api.pirsch.io/pa.js"
          id="pianjs"
          data-code={process.env.NEXT_PUBLIC_PIRSCH_ANALYTICS_PID}
        />
      )}
      {process.env.NEXT_PUBLIC_VERCEL_ENV === "development" && (
        <Script
          defer
          src="https://api.pirsch.io/pa.js"
          id="pianjs"
          data-code={process.env.NEXT_PUBLIC_PIRSCH_ANALYTICS_PID}
        />
      )}
      <Head>
        <meta property="og:locale" content={locale} />
      </Head>
      <ThemeContextController>
        <EvmWalletSelectorContextController>
          <ToastContextController>
            <AuthorizationContextController>
              <DiscordContextController>
                <AnalyticsContextController>
                  <div id="modal-root" />
                  <div id="dropdown-portal" />
                  <div className={clsx(styles["home-layout"])}>
                    <Navbar />

                    <MainPanel>{children}</MainPanel>

                    <Footer />
                  </div>
                </AnalyticsContextController>
              </DiscordContextController>
            </AuthorizationContextController>
          </ToastContextController>
        </EvmWalletSelectorContextController>
      </ThemeContextController>
    </>
  );
};
