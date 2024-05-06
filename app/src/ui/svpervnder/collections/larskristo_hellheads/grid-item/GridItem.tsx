import clsx from "clsx";
import { useState } from "react";

import { Grid } from "ui/grid/Grid";
import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";
import { useLarskristoHellheadsContext } from "context/evm/larskristo-hellheads/useLarskristoHellheadsContext";
import { TokenPrice } from "context/evm/larskristo-hellheads/LarskristoHellheadsContext.types";
import { Button } from "ui/button/Button";

import styles from "./GridItem.module.scss";
import { GridItemProps } from "./GridItem.types";

export const GridItem: React.FC<GridItemProps> = ({ item, handleExpand, className }) => {
  const [tokenPrice, setTokenPrice] = useState<TokenPrice | undefined>();
  const [isFetchingTokenPrice, setIsFetchingTokenPrice] = useState(false);

  const ERC721 = useLarskristoHellheadsContext();

  const handleOnRevealPriceClick = async () => {
    if (tokenPrice) {
      return;
    }

    setIsFetchingTokenPrice(true);

    const result = await ERC721.getTokenPrice(item.id, { excludeExchangeRate: true });

    setTokenPrice(result);

    setIsFetchingTokenPrice(false);
  };

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

    return <>{isFetchingTokenPrice && "..."}</>;
  };

  return (
    <Grid.Col lg={2} xs={6} key={item.thumbnail} className={clsx(styles["grid-item"], className)}>
      <Card className={styles["grid-item"]} withSpotlightEffect>
        <div className={styles["grid-item__img"]}>
          <img src={item.thumbnail} alt={item.name} />
        </div>
        <Card.Content>
          <div className={styles["grid-item__name-row"]}>
            <Typography.Description className={styles["grid-item__name-row--name"]}>{item.name}</Typography.Description>
            <Typography.Description>#{item.id}</Typography.Description>
          </div>
          <div className={styles["grid-item__price-row"]}>
            <div>
              {!tokenPrice?.formattedValue ? (
                <Button
                  variant="text"
                  color="secondary"
                  size="l"
                  onClick={handleOnRevealPriceClick}
                  className={styles["grid-item__price-row--button"]}
                >
                  Reveal Price
                </Button>
              ) : (
                <Typography.TextLead flat className={styles["grid-item__price-row--amount"]}>
                  {renderTokenPrice()}
                </Typography.TextLead>
              )}
            </div>
            <div>
              <Icon name="icon-expand" className={styles["grid-item__expand"]} onClick={() => handleExpand(item)} />
            </div>
          </div>
        </Card.Content>
      </Card>
    </Grid.Col>
  );
};
