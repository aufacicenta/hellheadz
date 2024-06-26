export type Styles = {
  "text__align--center": string;
  "text__color--info": string;
  "text__color--primary": string;
  "text__color--typography-text": string;
  text__truncate: string;
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
