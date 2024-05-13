import clsx from "clsx";

import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";

import { ArtistsProps } from "./Artists.types";
import styles from "./Artists.module.scss";

export const Artists: React.FC<ArtistsProps> = ({ className }) => (
  <div className={clsx(styles.artists, className)}>
    <Grid.Container>
      <Grid.Row>
        <Grid.Col lg={6} sm={12} xs={12}>
          <section className={styles.artists__hero}>
            <Typography.Headline1>Lars Kristo</Typography.Headline1>
            <Typography.TextLead>
              Larskristo's artistic journey began with a quiet intensity, delving into the shadows where emotions lie in
              their rawest form. His early works were haunting glimpses into the human soul, capturing the delicate
              balance between vulnerability and resilience.
            </Typography.TextLead>
          </section>
        </Grid.Col>
        <Grid.Col lg={6} sm={12} xs={12}>
          <div />
        </Grid.Col>
      </Grid.Row>
    </Grid.Container>
  </div>
);
