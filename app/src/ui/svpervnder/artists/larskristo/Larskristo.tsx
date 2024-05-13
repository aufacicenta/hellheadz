import clsx from "clsx";

import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import { Button } from "ui/button/Button";

import { LarskristoProps } from "./Larskristo.types";
import styles from "./Larskristo.module.scss";

export const Larskristo: React.FC<LarskristoProps> = ({ className }) => (
  <div className={clsx(styles.larskristo, className)}>
    <Grid.Container>
      <Grid.Row>
        <Grid.Col lg={6} sm={12} xs={12}>
          <section className={styles.larskristo__hero}>
            <Typography.Headline1>Lars Kristo</Typography.Headline1>
            <Typography.TextLead>
              Larskristo's artistic journey began with a quiet intensity, delving into the shadows where emotions lie in
              their rawest form. His early works were haunting glimpses into the human soul, capturing the delicate
              balance between vulnerability and resilience.
            </Typography.TextLead>
            <div className={styles["larskristo__socials-row"]}>
              <Button
                respectCase
                as="link"
                leftIcon={<Icon name="icon-instagram" />}
                variant="outlined"
                color="secondary"
                target="_blank"
                href="https://www.instagram.com/larskristo"
              >
                larskristo
              </Button>
              <Button
                respectCase
                as="link"
                leftIcon={<Icon name="icon-tiktok" />}
                variant="outlined"
                color="secondary"
                target="_blank"
                href="https://www.instagram.com/larskristo"
              >
                larskristo
              </Button>
            </div>
          </section>
        </Grid.Col>
        <Grid.Col lg={6} sm={12} xs={12}>
          <div />
        </Grid.Col>
      </Grid.Row>
    </Grid.Container>
  </div>
);
