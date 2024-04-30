import clsx from "clsx";
import { Hidden } from "react-grid-system";

import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { SvpervnderLogo } from "ui/icons/SvpervnderLogo";
import { useRoutes } from "hooks/useRoutes/useRoutes";

import styles from "./Footer.module.scss";
import { FooterProps } from "./Footer.types";

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const routes = useRoutes();

  return (
    <footer className={clsx(styles.footer, className)}>
      <Grid.Container>
        <Grid.Row>
          <Hidden xs>
            <Grid.Col lg={4}>
              <div />
            </Grid.Col>
          </Hidden>
          <Grid.Col lg={4} sm={6} xs={6}>
            <div className={styles.footer__center}>
              <div className={styles["footer__center--item"]}>
                <Typography.Text flat>svpervnder</Typography.Text>
                <Typography.MiniDescription flat>2024. All Rights Reserved</Typography.MiniDescription>
              </div>
            </div>
          </Grid.Col>
          <Grid.Col lg={4} sm={6} xs={6}>
            <div className={styles.footer__right}>
              <div className={styles["footer__right--item"]}>
                <Typography.Link flat href={routes.home()} className={styles["footer__powered-by"]}>
                  <SvpervnderLogo />
                </Typography.Link>
              </div>
            </div>
          </Grid.Col>
        </Grid.Row>
      </Grid.Container>
    </footer>
  );
};
