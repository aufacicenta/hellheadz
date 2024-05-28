import clsx from "clsx";

import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";

import styles from "./Footer.module.scss";
import { FooterProps } from "./Footer.types";

export const Footer: React.FC<FooterProps> = ({ className }) => (
  <footer className={clsx(styles.footer, className)}>
    <Grid.Container>
      <Grid.Row>
        <Grid.Col lg={6} sm={6} xs={6}>
          <div className={styles.footer__left}>
            <div className={styles["footer__left--item"]}>
              <Typography.Text flat>hellheadz</Typography.Text>
              <Typography.MiniDescription flat>
                {new Date().getFullYear()}. All Rights Reserved
              </Typography.MiniDescription>
            </div>
          </div>
        </Grid.Col>
        <Grid.Col lg={6} sm={6} xs={6}>
          <div className={styles.footer__right}>
            <div className={styles["footer__right--item"]}>
              <Typography.Link flat href="#">
                Events
              </Typography.Link>
            </div>
            <div className={styles["footer__right--item"]}>
              <Typography.Link flat href="#">
                About
              </Typography.Link>
            </div>
          </div>
        </Grid.Col>
      </Grid.Row>
    </Grid.Container>
  </footer>
);
