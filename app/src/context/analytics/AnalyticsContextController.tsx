/* eslint-disable @typescript-eslint/no-explicit-any */
import React from "react";

import { AnalyticsContext } from "./AnalyticsContext";
import { AnalyticsContextControllerProps, AnalyticsContextType, AnalyticsEvent } from "./AnalyticsContext.types";

const onClick = (event: AnalyticsEvent) => {
  (window as any)
    .pirsch(event.name, {
      meta: event.meta,
    })
    .then(() => {
      console.log(`AnalyticsContextController.onClick: ${event.name}, ${JSON.stringify(event.meta)}`);
    })
    .catch((error: Error) => {
      console.error(error);
    });
};

export const AnalyticsContextController = ({ children }: AnalyticsContextControllerProps) => {
  const props: AnalyticsContextType = {
    onClick,
  };

  return <AnalyticsContext.Provider value={props}>{children}</AnalyticsContext.Provider>;
};
