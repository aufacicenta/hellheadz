import { ReactNode } from "react";

export type AnalyticsContextControllerProps = {
  children: ReactNode;
};

export type AnalyticsEvent = {
  name: string;
  meta?: Record<string, string | number | undefined>;
};

export type AnalyticsContextType = {
  onClick: (event: AnalyticsEvent) => void;
};
