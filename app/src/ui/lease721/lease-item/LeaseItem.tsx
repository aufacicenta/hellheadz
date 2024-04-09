import clsx from "clsx";

import { Card } from "ui/card/Card";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";

import { LeaseItemProps } from "./LeaseItem.types";
import styles from "./LeaseItem.module.scss";

export const LeaseItem: React.FC<LeaseItemProps> = ({ className, item }) => (
  <div className={clsx(styles["lease-item"], className)}>
    <Card shadow>
      <div className={styles["lease-item__featured-image"]}>
        <img src={item.featuredImageUrl} alt={item.name} />
      </div>
      <Card.Content>
        <div className={styles["lease-item__name-price-row"]}>
          <Typography.TextBold flat>{item.name}</Typography.TextBold>
          <Typography.Text flat>
            {item.pricePerHour} <Typography.Description inline>ETH/h</Typography.Description>
          </Typography.Text>
        </div>
        <div className={styles["lease-item__owner-contract-row"]}>
          <div>
            <Typography.MiniDescription flat>Owner</Typography.MiniDescription>
            <Typography.Text flat>{item.ownerAddress}</Typography.Text>
          </div>
          <div>
            <Typography.MiniDescription flat>Contract</Typography.MiniDescription>
            <Typography.Text flat>{item.contractAddress}</Typography.Text>
          </div>
        </div>
      </Card.Content>
      <Card.Actions className={styles["lease-item__actions"]}>
        <Button variant="text" size="xs">
          Details
        </Button>
        <Button variant="outlined" size="xs">
          Rent Now
        </Button>
      </Card.Actions>
    </Card>
  </div>
);
