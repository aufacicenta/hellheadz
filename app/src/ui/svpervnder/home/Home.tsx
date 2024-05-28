import clsx from "clsx";
import dynamic from "next/dynamic";

import { LatestCollectionProps } from "../collections/larskristo_hellheads/LarsKristoHellheads.types";

import { HomeProps } from "./Home.types";
import styles from "./Home.module.scss";

const LarsKristoHellheadsContainer = dynamic<LatestCollectionProps>(
  () =>
    import("../collections/larskristo_hellheads/LarsKristoHellheadsContainer").then(
      (mod) => mod.LarsKristoHellheadsContainer,
    ),
  { ssr: false },
);

export const Home: React.FC<HomeProps> = ({ className }) => (
  <div className={clsx(styles.home, className)}>
    <LarsKristoHellheadsContainer />
  </div>
);
