import clsx from "clsx";

import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { SvpervnderLogo } from "ui/icons/SvpervnderLogo";

import styles from "./Footer.module.scss";
import { FooterProps } from "./Footer.types";

export const Footer: React.FC<FooterProps> = ({ className }) => (
  <footer className={clsx(styles.footer, className)}>
    <Grid.Container>
      <Grid.Row>
        <Grid.Col lg={4} sm={4} xs={4}>
          <div />
        </Grid.Col>
        <Grid.Col lg={4} sm={4} xs={4}>
          <div className={styles.footer__center}>
            <div className={styles["footer__center--item"]}>
              <Typography.Text flat>svpervnder</Typography.Text>
              <Typography.MiniDescription flat>2024. All Rights Reserved</Typography.MiniDescription>
            </div>
          </div>
        </Grid.Col>
        <Grid.Col lg={4} sm={4} xs={4}>
          <div className={styles.footer__right}>
            <div className={styles["footer__right--item"]}>
              <Typography.Link
                flat
                href="https://svpervnder.com"
                target="_blank"
                className={styles["footer__powered-by"]}
              >
                <SvpervnderLogo />
              </Typography.Link>
            </div>
          </div>
        </Grid.Col>
      </Grid.Row>
    </Grid.Container>
  </footer>
);
