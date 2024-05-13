import { ReactNode } from "react";

export type LatestCollectionProps = {
  children?: ReactNode;
  className?: string;
};

export type ItemMetadata = {
  id: number;
  name: string;
  description: string;
  image: string;
  thumbnail: string;
};
