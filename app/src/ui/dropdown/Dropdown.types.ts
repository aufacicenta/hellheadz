import { DetailedHTMLProps, HTMLAttributes, ReactNode, CSSProperties } from "react";
import { Placement } from "@popperjs/core";

export type DropdownProps = DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> & {
  children?: ReactNode;
  id?: string;
  trigger: ReactNode;
  size?: "m" | "l";
  "aria-describedby"?: string;
  listboxClassName?: string;
  listboxStyle?: CSSProperties;
  disabled?: boolean;
  placement?: Placement;
  isOpenedByDefault?: boolean;
  onSelectFocusedItem?(index: number): void;
};
