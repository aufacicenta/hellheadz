import clsx from "clsx";

import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";
import { Card } from "ui/card/Card";
import { Icon } from "ui/icon/Icon";

import styles from "./LarsKristoHellheads.module.scss";
import { LatestCollectionProps } from "./LarsKristoHellheads.types";
import metadata from "./metadata.json";

const SEPOLIA_TESTNET_ADDRESS = "0x5D003EBE7348d6D3aC1a397619ED2016711d7615";

export const LarsKristoHellheads: React.FC<LatestCollectionProps> = ({ className }) => (
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
              Larskristo Hellheads is the latest from its #darkart creations. Featuring an astonishing {metadata.length}{" "}
              items series of digital handcraft mastery. Own one of this limited art today.
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
          {metadata.map((item) => (
            <Grid.Col lg={3} xs={6} key={item.thumbnail}>
              <Card className={styles["latest-collection__item"]} withSpotlightEffect>
                <div className={styles["latest-collection__item--img"]}>
                  <img src={item.thumbnail} alt={item.name} />
                </div>
                <Card.Content>
                  <div className={styles["latest-collection__item--name-row"]}>
                    <div>
                      <Typography.Description>{item.name}</Typography.Description>
                    </div>
                    <div>
                      <Button size="xs" variant="outlined" color="secondary">
                        Available
                      </Button>
                    </div>
                  </div>
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
          ))}
        </Grid.Row>
      </section>
    </Grid.Container>
  </div>
);
