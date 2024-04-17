import clsx from "clsx";

import { Typography } from "ui/typography/Typography";
import { Grid } from "ui/grid/Grid";
import { LarsKristoHellheads } from "../collections/larskristo_hellheads/LarsKristoHellheads";

import { HomeProps } from "./Home.types";
import styles from "./Home.module.scss";

export const Home: React.FC<HomeProps> = ({ className }) => (
  <div className={clsx(styles.home, className)}>
    <Grid.Container>
      <Grid.Row>
        <Grid.Col lg={6} sm={12} xs={12}>
          <section className={styles.home__hero}>
            <Typography.Headline1>Súper Únderground</Typography.Headline1>
            <Typography.TextLead>Artists, Collections & Events</Typography.TextLead>
          </section>
        </Grid.Col>
        <Grid.Col lg={6} sm={12} xs={12}>
          <div />
        </Grid.Col>
      </Grid.Row>
    </Grid.Container>

    <LarsKristoHellheads />
  </div>
);
