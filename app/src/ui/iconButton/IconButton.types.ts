import { ButtonCommonProps, DefaultButtonProps, AnchorButtonProps } from "../button/Button.types";

export type IconButtonProps = Omit<ButtonCommonProps, "size"> &
  (AnchorButtonProps | DefaultButtonProps) & {
    size?: "xxs" | "xs" | "s" | "m" | "l";
  };
