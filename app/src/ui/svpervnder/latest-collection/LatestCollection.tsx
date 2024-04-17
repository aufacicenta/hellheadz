import clsx from "clsx";

import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";
import { Card } from "ui/card/Card";
import { Icon } from "ui/icon/Icon";

import styles from "./LatestCollection.module.scss";
import { LatestCollectionProps } from "./LatestCollection.types";

export const LatestCollection: React.FC<LatestCollectionProps> = ({ className }) => (
  <div className={clsx(styles["latest-collection"], className)}>
    <Grid.Container>
      <Grid.Row justify="end">
        <Grid.Col lg={8} sm={12} xs={12}>
          <div />
        </Grid.Col>
        <Grid.Col lg={4} sm={12} xs={12}>
          <div className={styles["latest-collection__intro"]}>
            <Typography.Headline5>Latest Collection</Typography.Headline5>
            <Typography.Headline4 className={styles["latest-collection__intro--artist-name"]}>
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

      <section className={styles["latest-collection__grid"]}>
        <Grid.Row>
          <Grid.Col lg={2}>
            <Card className={styles["latest-collection__item"]}>
              <div className={styles["latest-collection__item--img"]}>
                <img
                  src="https://blockchainassetregistry.infura-ipfs.io/ipfs/bafybeifwil5ygel6cw2kdplp5s74qeyg64wydpoiko7or42pb2n45outd4/058.JPG"
                  alt="058"
                />
              </div>
              <Card.Content>
                <Typography.Description>#598</Typography.Description>
                <div className={styles["latest-collection__item--price-row"]}>
                  <div>
                    <Typography.TextLead flat className={styles["latest-collection__item--price"]}>
                      1.75 <span>ETH</span>
                    </Typography.TextLead>
                  </div>
                  <div>
                    <Icon name="icon-expand" className={styles["latest-collection__item--expand"]} />
                  </div>
                </div>
              </Card.Content>
            </Card>
          </Grid.Col>
        </Grid.Row>
      </section>
    </Grid.Container>
  </div>
);
