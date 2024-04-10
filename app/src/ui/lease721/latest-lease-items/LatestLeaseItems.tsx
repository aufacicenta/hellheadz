import clsx from "clsx";

import { LeaseItem } from "../lease-item/LeaseItem";

import { LatestLeaseItemsProps } from "./LatestLeaseItems.types";
import styles from "./LatestLeaseItems.module.scss";

export const LatestLeaseItems: React.FC<LatestLeaseItemsProps> = ({ className, items }) => (
  <div className={clsx(styles["latest-lease-items"], className)}>
    {items.map((item) => (
      <LeaseItem item={item} key={item.contractAddress} />
    ))}
  </div>
);
