export type Styles = {
  "grid-item": string;
  "grid-item__expand": string;
  "grid-item__img": string;
  "grid-item__name-row": string;
  "grid-item__price": string;
  "grid-item__price-row": string;
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
