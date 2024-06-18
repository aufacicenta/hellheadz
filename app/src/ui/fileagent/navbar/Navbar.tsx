import clsx from "clsx";

import { Grid } from "ui/grid/Grid";
import { AufacicentaIcon } from "ui/icons/AufacicentaIcon";

import { NavbarProps } from "./Navbar.types";
import styles from "./Navbar.module.scss";

export const Navbar: React.FC<NavbarProps> = ({ className }) => (
  <div className={clsx(styles.navbar, className)}>
    <Grid.Container>
      <Grid.Row>
        <Grid.Col lg={4} sm={4} xs={4}>
          <div className={clsx(styles.navbar__left)}>
            <div className={clsx(styles["navbar__left--item"], styles.navbar__logo)}>
              <AufacicentaIcon />
            </div>
          </div>
        </Grid.Col>
        <Grid.Col lg={4} sm={4} xs={4}>
          <div className={styles.navbar__center} />
        </Grid.Col>
        <Grid.Col lg={4} sm={4} xs={4}>
          <div className={styles.navbar__right} />
        </Grid.Col>
      </Grid.Row>
    </Grid.Container>
  </div>
);
