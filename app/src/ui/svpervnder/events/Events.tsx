import clsx from "clsx";

import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { Marketplaces } from "../collections/larskristo_hellheads/marketplaces/Marketplaces";
import { Button } from "ui/button/Button";
import { useAnalyticsContext } from "context/analytics/useAnalyticsContext";
import analytics from "providers/analytics";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { Icon } from "ui/icon/Icon";

import styles from "./Events.module.scss";
import { EventsProps } from "./Events.types";

export const Events: React.FC<EventsProps> = ({ className }) => {
  const routes = useRoutes();
  const AnalyticsContext = useAnalyticsContext();

  const onAnalyticsTrackingClick = () => {
    AnalyticsContext.onClick({ name: analytics.EventTracking.click.navbar.wallet_selector });
  };

  return (
    <div className={clsx(styles.events, className)}>
      <Grid.Container>
        <Grid.Row>
          <Grid.Col lg={6} sm={12} xs={12}>
            <section className={styles.events__hero}>
              <Typography.Headline1>Events</Typography.Headline1>
              <Typography.TextLead>Access exclusive events by owning one or more Hellheadz.</Typography.TextLead>

              <div className={styles.events__box}>
                <Typography.Headline5>Stay on the loop</Typography.Headline5>
                <Button
                  as="link"
                  href={routes.socials.discord}
                  rightIcon={<Icon name="icon-discord" />}
                  color="primary"
                  variant="outlined"
                  onClick={() => onAnalyticsTrackingClick()}
                >
                  Join Discord
                </Button>
              </div>

              <div className={styles.events__box}>
                <Typography.Headline5>Buy one at</Typography.Headline5>
                <Marketplaces />
              </div>
            </section>
          </Grid.Col>
          <Grid.Col lg={6} sm={12} xs={12}>
            <div />
          </Grid.Col>
        </Grid.Row>
      </Grid.Container>
    </div>
  );
};
