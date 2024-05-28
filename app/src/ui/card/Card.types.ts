import { HTMLAttributes, ReactNode } from "react";

import { SpacingProps } from "../../theme/theme.types";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
  backgroundImageUrl?: string;
  url?: string;
  shadow?: boolean;
  withSpotlightEffect?: boolean;
} & SpacingProps;

export type CardContentProps = {
  children: ReactNode;
  className?: string;
};

export type CardActionsProps = {
  children: ReactNode;
  className?: string;
};
