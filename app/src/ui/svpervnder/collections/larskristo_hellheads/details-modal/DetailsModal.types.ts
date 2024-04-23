import { ReactNode } from "react";

import { ItemMetadata } from "../LarsKristoHellheads.types";

export type DetailsModalProps = {
  children?: ReactNode;
  className?: string;
  item: ItemMetadata;
  onClose: () => void;
};
