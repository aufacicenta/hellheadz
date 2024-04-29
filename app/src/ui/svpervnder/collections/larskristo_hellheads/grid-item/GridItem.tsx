import clsx from "clsx";
import { useEffect, useState } from "react";

import { Grid } from "ui/grid/Grid";
import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import { useLarskristoHellheadsContext } from "context/evm/larskristo-hellheads/useLarskristoHellheadsContext";
import { TokenPrice } from "context/evm/larskristo-hellheads/LarskristoHellheadsContext.types";

import styles from "./GridItem.module.scss";
import { GridItemProps } from "./GridItem.types";

export const GridItem: React.FC<GridItemProps> = ({ item, index, handleExpand, className }) => {
  const [tokenPrice, setTokenPrice] = useState<TokenPrice | undefined>();
  const [isFetchingTokenPrice, setIsFetchingTokenPrice] = useState(false);

  const ERC721 = useLarskristoHellheadsContext();

  useEffect(() => {
    if (tokenPrice) {
      return;
    }

    setIsFetchingTokenPrice(true);

    setTimeout(async () => {
      const result = await ERC721.getTokenPrice(index, { excludeExchangeRate: true });

      setTokenPrice(result);

      setIsFetchingTokenPrice(false);
    }, 100 * (index + 1));
  }, [tokenPrice?.rawValue]);

  const renderTokenPrice = () => {
    if (tokenPrice?.rawValue === BigInt(0)) {
      return "Sold Out";
    }

    if (tokenPrice?.formattedValue) {
      return (
        <>
          {tokenPrice?.formattedValue} <span> ETH</span>
        </>
      );
    }

    return <>{isFetchingTokenPrice ? "..." : "Reveal Price"}</>;
  };

  return (
    <Grid.Col lg={3} xs={12} key={item.thumbnail} className={clsx(styles["grid-item"], className)}>
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
                {renderTokenPrice()}
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
