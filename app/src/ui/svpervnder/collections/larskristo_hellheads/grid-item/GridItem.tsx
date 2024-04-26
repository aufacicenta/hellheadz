import clsx from "clsx";
import { useEffect } from "react";

import { Grid } from "ui/grid/Grid";
import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import { useLarskristoHellheadsContext } from "context/evm/larskristo-hellheads/useLarskristoHellheadsContext";

import styles from "./GridItem.module.scss";
import { GridItemProps } from "./GridItem.types";

export const GridItem: React.FC<GridItemProps> = ({ item, index, handleExpand, className }) => {
  const ERC721 = useLarskristoHellheadsContext();

  useEffect(() => {
    (async () => {
      await ERC721.getTokenPrice(index);
    })();
  }, [index]);

  return (
    <Grid.Col lg={3} xs={6} key={item.thumbnail} className={clsx(styles["grid-item"], className)}>
      <Card className={styles["grid-item"]} withSpotlightEffect>
        <div className={styles["grid-item__img"]}>
          <img src={item.thumbnail} alt={item.name} />
        </div>
        <Card.Content>
          <div className={styles["grid-item__name-row"]}>
            <div>
              <Typography.Description>{item.name}</Typography.Description>
            </div>
          </div>
          <div className={styles["grid-item__price-row"]}>
            <div>
              <Typography.TextLead flat className={styles["grid-item__price"]}>
                {ERC721.tokenPrice?.formattedValue} <span>ETH</span>
              </Typography.TextLead>
            </div>
            <div>
              <Icon
                name="icon-expand"
                className={styles["grid-item__expand"]}
                onClick={() => handleExpand(item, index)}
              />
            </div>
          </div>
        </Card.Content>
      </Card>
    </Grid.Col>
  );
};
