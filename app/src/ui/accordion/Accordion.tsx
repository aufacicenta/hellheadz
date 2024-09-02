import clsx from "clsx";
import { useEffect, useState } from "react";

import { Icon } from "ui/icon/Icon";
import { useAnalyticsContext } from "context/analytics/useAnalyticsContext";

import { AccordionContentProps, AccordionHeaderProps, AccordionProps } from "./Accordion.types";
import styles from "./Accordion.module.scss";

export const Accordion: React.FC<AccordionProps> & {
  Header: React.FC<AccordionHeaderProps>;
  Content: React.FC<AccordionContentProps>;
} = ({ className, accordionHeader, accordionContent, isDefaultExpanded, analyticsEvent }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const AnalyticsContext = useAnalyticsContext();

  useEffect(() => {
    setIsExpanded(!!isDefaultExpanded);
  }, [isDefaultExpanded]);

  const onClickHeaderTrigger = () => {
    setIsExpanded(!isExpanded);

    if (analyticsEvent?.name) {
      AnalyticsContext.onClick(analyticsEvent);
    }
  };

  return (
    <div
      className={clsx(styles.accordion, className, {
        [styles.accordion__expanded]: isExpanded,
      })}
    >
      <Accordion.Header onClick={onClickHeaderTrigger}>
        {accordionHeader}

        <div className={styles["accordion__header--trigger"]}>
          {isExpanded ? <Icon name="icon-chevron-down" /> : <Icon name="icon-chevron-right" />}
        </div>
      </Accordion.Header>

      <Accordion.Content>{accordionContent}</Accordion.Content>
    </div>
  );
};

const Header: React.FC<AccordionHeaderProps> = ({ children, className, ...props }) => (
  <div className={clsx(styles.accordion__header, className)} {...props}>
    {children}
  </div>
);

const Content: React.FC<AccordionContentProps> = ({ children, className }) => (
  <div className={clsx(styles.accordion__content, className)}>{children}</div>
);

Accordion.Header = Header;
Accordion.Content = Content;
