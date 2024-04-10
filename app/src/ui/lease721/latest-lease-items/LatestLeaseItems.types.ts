import { ReactNode } from "react";

import { LeaseItemProps } from "../lease-item/LeaseItem.types";

export type LatestLeaseItemsProps = {
  items: LeaseItemProps["item"][];
  children?: ReactNode;
  className?: string;
};
