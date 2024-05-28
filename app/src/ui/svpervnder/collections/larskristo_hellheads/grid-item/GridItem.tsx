import clsx from "clsx";

import { Grid } from "ui/grid/Grid";
import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Icon } from "ui/icon/Icon";

import styles from "./GridItem.module.scss";
import { GridItemProps } from "./GridItem.types";

export const GridItem: React.FC<GridItemProps> = ({ item, handleExpand, className }) => (
  <Grid.Col lg={2} xs={6} key={item.thumbnail} className={clsx(styles["grid-item"], className)}>
    <Card className={styles["grid-item"]} withSpotlightEffect onClick={() => handleExpand(item)}>
      <div className={styles["grid-item__img"]}>
        <img src={item.thumbnail} alt={item.name} />
      </div>
      <Card.Content>
        <div className={styles["grid-item__name-row"]}>
          <Typography.Description flat className={styles["grid-item__name-row--name"]}>
            {item.name}
          </Typography.Description>
          <Typography.Description flat>#{item.id + 1}</Typography.Description>
        </div>
        <div className={styles["grid-item__price-row"]}>
          <div />
          <div>
            <Icon name="icon-expand" className={styles["grid-item__expand"]} />
          </div>
        </div>
      </Card.Content>
    </Card>
  </Grid.Col>
);
