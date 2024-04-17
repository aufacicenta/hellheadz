import clsx from "clsx";

import { Typography } from "ui/typography/Typography";
import { Grid } from "ui/grid/Grid";
import { Button } from "ui/button/Button";

import { HomeProps } from "./Home.types";
import styles from "./Home.module.scss";

export const Home: React.FC<HomeProps> = ({ children, className }) => (
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
    <Grid.Container>
      <Grid.Row justify="end">
        <Grid.Col lg={8} sm={12} xs={12}>
          <div />
        </Grid.Col>
        <Grid.Col lg={4} sm={12} xs={12}>
          <div className={styles["home__latest-collections"]}>
            <Typography.Headline5>Latest Collection</Typography.Headline5>
            <Typography.Headline4 className={styles["home__latest-collections--artist-name"]}>
              larskristo: hellheads
            </Typography.Headline4>
            <Typography.Description>31/150 Sold</Typography.Description>
            <Typography.Text>
              Lars Kristoffer Hormander’s Hellheads is the latest from its #darkart creations. Featuring an astonishing
              150 items series of digital handcraft mastery. Own one of this limited art today.
            </Typography.Text>
            <Grid.Row>
              <Grid.Col>
                <Button color="secondary" size="s" variant="outlined">
                  See Artist
                </Button>
              </Grid.Col>
            </Grid.Row>
          </div>
        </Grid.Col>
      </Grid.Row>
    </Grid.Container>
  </div>
);
