import { ReactNode } from "react";

export type LeaseItemProps = {
  item: {
    featuredImageUrl: string;
    name: string;
    pricePerHour: string;
    ownerAddress: string;
    contractAddress: string;
  };
  children?: ReactNode;
  className?: string;
};
