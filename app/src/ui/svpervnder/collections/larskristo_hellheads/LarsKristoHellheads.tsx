import clsx from "clsx";
import { useState } from "react";

import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";
import { useRoutes } from "hooks/useRoutes/useRoutes";

import styles from "./LarsKristoHellheads.module.scss";
import { ItemMetadata, LatestCollectionProps } from "./LarsKristoHellheads.types";
import metadata from "./metadata.json";
import { DetailsModal } from "./details-modal/DetailsModal";
import { GridItem } from "./grid-item/GridItem";

export const LarsKristoHellheads: React.FC<LatestCollectionProps> = ({ className }) => {
  const [isDetailsModalVisible, displayDetailsModals] = useState(false);
  const [currentItem, setCurrentItem] = useState<ItemMetadata | undefined>();

  const routes = useRoutes();

  const handleExpand = (item: ItemMetadata, tokenId: number) => {
    setCurrentItem({ ...item, id: tokenId });
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
                  Lars Kristo: Hellheadz
                </Typography.Headline4>
                <Typography.Description>31/222 Sold</Typography.Description>
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
              {metadata.map((item: ItemMetadata, index) => (
                <GridItem key={item.thumbnail} item={item} index={index} handleExpand={handleExpand} />
              ))}
            </Grid.Row>
          </section>
        </Grid.Container>
      </div>

      {isDetailsModalVisible && <DetailsModal onClose={handleClose} item={currentItem!} />}
    </>
  );
};
