import { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

import { ButtonCommonProps } from "ui/button/Button.types";

type GeneralProps = {
  children?: ReactNode;
  inline?: boolean;
  flat?: boolean;
  truncate?: boolean;
  align?: "center" | "right";
  color?: string;
  fontFamilyDisplay?: boolean;
};

export type TypographyProps = HTMLAttributes<HTMLParagraphElement> & {
  children?: ReactNode;
  className?: string;
} & GeneralProps;

export type AnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> &
  GeneralProps & {
    as?: "button";
    size?: ButtonCommonProps["size"];
    variant?: ButtonCommonProps["variant"];
  };
