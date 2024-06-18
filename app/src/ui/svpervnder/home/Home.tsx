import clsx from "clsx";

import { HomeProps } from "./Home.types";
import styles from "./Home.module.scss";

export const Home: React.FC<HomeProps> = ({ className }) => <div className={clsx(styles.home, className)} />;
