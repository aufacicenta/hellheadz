import clsx from "clsx";

import { LeaseItemProps } from "../lease-item/LeaseItem.types";
import { LeaseItem } from "../lease-item/LeaseItem";

import { LatestLeaseItemsProps } from "./LatestLeaseItems.types";
import styles from "./LatestLeaseItems.module.scss";

const items: LeaseItemProps["item"][] = [
  {
    featuredImageUrl:
      "https://highlight-creator-assets.highlight.xyz/main/image/d704273a-6c72-46fb-be3a-0ee5facab689.jpeg?d=720x720",
    name: "Test",
    pricePerHour: "0.1",
    ownerAddress: "0x123",
    contractAddress: "0x456",
  },
  {
    featuredImageUrl:
      "https://highlight-creator-assets.highlight.xyz/main/image/02d89c82-c603-4dec-be1f-c85d2812f796.jpeg?d=720x720",
    name: "Test",
    pricePerHour: "0.1",
    ownerAddress: "0x123",
    contractAddress: "0x456",
  },
  {
    featuredImageUrl:
      "https://highlight-creator-assets.highlight.xyz/main/image/99eba21e-e3f9-4760-9590-c8be6625a3da.jpeg?d=720x720",
    name: "Test",
    pricePerHour: "0.1",
    ownerAddress: "0x123",
    contractAddress: "0x456",
  },
];

export const LatestLeaseItems: React.FC<LatestLeaseItemsProps> = ({ className }) => (
  <div className={clsx(styles["latest-lease-items"], className)}>
    {items.map((item) => (
      <LeaseItem item={item} key={item.contractAddress} />
    ))}
  </div>
);
