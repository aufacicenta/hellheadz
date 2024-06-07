export type Styles = {
  accordion: string;
  accordion__content: string;
  accordion__expanded: string;
  accordion__header: string;
  "accordion__header--trigger": string;
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
