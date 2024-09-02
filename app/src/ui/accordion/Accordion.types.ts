import { HTMLAttributes, ReactNode } from "react";

import { AnalyticsEvent } from "context/analytics/AnalyticsContext.types";

export type AccordionProps = HTMLAttributes<HTMLDivElement> & {
  accordionHeader: ReactNode;
  accordionContent: ReactNode;
  analyticsEvent?: AnalyticsEvent;
  isDefaultExpanded?: boolean;
  className?: string;
};

export type AccordionHeaderProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  className?: string;
};

export type AccordionContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  className?: string;
};
