import { HTMLAttributes, ReactNode } from "react";

export type AccordionProps = HTMLAttributes<HTMLDivElement> & {
  accordionHeader: ReactNode;
  accordionContent: ReactNode;
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
