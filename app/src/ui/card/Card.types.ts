import { HTMLAttributes, ReactNode } from "react";

import { SpacingProps } from "../../theme/theme.types";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  className?: string;
  backgroundImageUrl?: string;
  url?: string;
  shadow?: boolean;
  withSpotlightEffect?: boolean;
  withInnerBorder?: boolean;
  withBackgroundGrain?: boolean;
} & SpacingProps;

export type CardContentProps = {
  children: ReactNode;
  className?: string;
  withInnerBorder?: boolean;
};

export type CardActionsProps = {
  children: ReactNode;
  className?: string;
};
