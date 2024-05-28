import clsx from "clsx";
import { useState } from "react";

import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { Card } from "ui/card/Card";
import metadataBatch0_22 from "providers/svpervnder/hellheadz/metadata-batch-0-22.json";
import { useLarskristoHellheadsContext } from "context/evm/larskristo-hellheads/useLarskristoHellheadsContext";

import styles from "./LarsKristoHellheads.module.scss";
import { ItemMetadata, LatestCollectionProps } from "./LarsKristoHellheads.types";
import { DetailsModal } from "./details-modal/DetailsModal";
import { GridItem } from "./grid-item/GridItem";

export const LarsKristoHellheads: React.FC<LatestCollectionProps> = ({ className }) => {
  const [isDetailsModalVisible, displayDetailsModals] = useState(false);
  const [currentItem, setCurrentItem] = useState<ItemMetadata | undefined>();

  const routes = useRoutes();
  const ERC721 = useLarskristoHellheadsContext();

  const handleExpand = (item: ItemMetadata) => {
    setCurrentItem(item);
    displayDetailsModals(true);
  };

  const handleClose = () => {
    displayDetailsModals(false);
  };

  return (
    <>
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
                  {ERC721.contractValues?.name}, {ERC721.contractValues?.symbol}
                </Typography.Headline4>
                <Grid.Row justify="end">
                  <Grid.Col lg={3} xs={3}>
                    <Typography.Description className={styles["latest-collection__stats--sub"]}>
                      31/{ERC721.contractValues?.tokenLimit} <span>Sold</span>
                    </Typography.Description>
                  </Grid.Col>
                  <Grid.Col lg={4} xs={3}>
                    <Typography.Description className={styles["latest-collection__stats--sub"]}>
                      22/{ERC721.contractValues?.tokenLimit} <span>Minted</span>
                    </Typography.Description>
                  </Grid.Col>
                </Grid.Row>
                <Typography.Text>
                  In 2022, Larskristo ventured deeper into the abyss, exploring the unsettling terrain of AI dark art.
                  This foray birthed Hellheadz — a chilling fusion of the ordinary and the grotesque. Here, everyday
                  objects metamorphosed into eerie spectacles, blurring the lines between reality and nightmare.
                </Typography.Text>
                <Grid.Row>
                  <Grid.Col>
                    <Button color="secondary" size="s" variant="outlined" as="link" href={routes.artists.larskristo()}>
                      See Artist
                    </Button>
                  </Grid.Col>
                </Grid.Row>
              </div>
            </Grid.Col>
          </Grid.Row>

          <section className={styles["latest-collection__grid"]}>
            <Grid.Row>
              {metadataBatch0_22.map((item: ItemMetadata, index) => (
                <>
                  {index === 6 && (
                    <Grid.Col lg={8} className={styles["latest-collection__grid--info-card-col"]} key="order-matters">
                      <Card>
                        <Card.Content className={styles["latest-collection__grid--info-card"]}>
                          <Typography.TextLead>Order matters.</Typography.TextLead>
                          <Typography.Headline3 flat>
                            Dark Clown is the first HH, made in early 2022's.
                          </Typography.Headline3>
                        </Card.Content>
                      </Card>
                    </Grid.Col>
                  )}

                  {index + 2 === 22 && (
                    <Grid.Col lg={6} className={styles["latest-collection__grid--info-card-col"]} key="token-limit">
                      <Card>
                        <Card.Content className={styles["latest-collection__grid--info-card"]}>
                          <Typography.TextLead>There are 666 HH to be minted</Typography.TextLead>
                          <Typography.Headline3>22 more next month.</Typography.Headline3>
                          <Button as="link" href="https://discord.gg/uEngc5U5" target="_blank">
                            Join Discord
                          </Button>
                        </Card.Content>
                      </Card>
                    </Grid.Col>
                  )}

                  <GridItem key={item.id} item={item} handleExpand={handleExpand} />
                </>
              ))}
            </Grid.Row>
          </section>
        </Grid.Container>
      </div>

      {isDetailsModalVisible && <DetailsModal onClose={handleClose} item={currentItem!} />}
    </>
  );
};
