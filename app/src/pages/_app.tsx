import { appWithTranslation } from "next-i18next";
import anime from "animejs";
import { AppProps } from "next/app";
import { setConfiguration } from "react-grid-system";
import "../theme/globals.css";
import "../theme/globals.scss";
import { useEffect } from "react";

setConfiguration({ containerWidths: [540, 740, 960, 1280, 1540], gutterWidth: 32 });

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const loader = document.querySelector<HTMLElement>("#global-loader");

      anime
        .timeline({
          easing: "easeInOutSine",
          duration: 1000,
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
        duration: 1000,
        delay: (_el, i) => i * 250,
        direction: "alternate",
        loop: true,
      });

      if (process.env.NEXT_PUBLIC_VERCEL_ENV === "development") {
        loader!.style.display = "none";

        return;
      }

      if (loader) {
        setTimeout(() => {
          loader.style.display = "none";
        }, 3500);
      }
    }
  }, []);

  return <Component {...pageProps} />;
}

export default appWithTranslation(MyApp);
