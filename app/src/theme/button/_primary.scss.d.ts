export type Styles = {
  "button-primary": string;
  "button-primary__icon": string;
  "button-primary__icon_left": string;
  "button-primary__icon_right": string;
  "button-primary_invert": string;
  "button-primary_large": string;
  "button-primary_medium": string;
  "z-depth-0": string;
  "z-depth-1": string;
  "z-depth-1-half": string;
  "z-depth-2": string;
  "z-depth-3": string;
  "z-depth-4": string;
  "z-depth-5": string;
};

export type ClassNames = keyof Styles;

declare const styles: Styles;

export default styles;
