import { ReactNode } from "react";

import { ItemMetadata } from "../LarsKristoHellheads.types";

export type GridItemProps = {
  children?: ReactNode;
  className?: string;
  item: ItemMetadata;
  handleExpand: (item: ItemMetadata) => void;
};
