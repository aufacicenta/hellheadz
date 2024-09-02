import clsx from "clsx";

import { Grid } from "ui/grid/Grid";
import { Button } from "ui/button/Button";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { useAnalyticsContext } from "context/analytics/useAnalyticsContext";
import analytics from "providers/analytics";

import styles from "./Marketplaces.module.scss";
import { MarketplacesProps } from "./Marketplaces.types";

export const Marketplaces: React.FC<MarketplacesProps> = ({ className }) => {
  const routes = useRoutes();
  const AnalyticsContext = useAnalyticsContext();

  const onClick = (marketplace: string) => {
    AnalyticsContext.onClick({
      name: analytics.EventTracking.click.homepage.marketplaces_button,
      meta: {
        marketplace,
      },
    });
  };

  return (
    <div className={clsx(styles.marketplaces, className)}>
      <Grid.Row>
        <Grid.Col lg={6}>
          <Button
            as="link"
            size="m"
            color="secondary"
            href={routes.marketplaces.opensea()}
            target="_blank"
            variant="outlined"
            fullWidth
            onClick={() => onClick("opensea")}
          >
            <img src="/hellheadz/marketplaces/opensea-logo.png" alt="OpenSea Logo" />
          </Button>
        </Grid.Col>
        <Grid.Col lg={6}>
          <Button
            as="link"
            size="m"
            color="secondary"
            href={routes.marketplaces.magiceden()}
            target="_blank"
            variant="outlined"
            fullWidth
            onClick={() => onClick("magiceden")}
          >
            <img src="/hellheadz/marketplaces/magiceden-logo.svg" alt="MagicEden Logo" />
          </Button>
        </Grid.Col>
        <Grid.Col lg={6}>
          <Button
            as="link"
            size="m"
            color="secondary"
            href={routes.marketplaces.x2y2()}
            target="_blank"
            variant="outlined"
            fullWidth
            onClick={() => onClick("x2y2")}
          >
            <img src="/hellheadz/marketplaces/x2y2-logo.svg" alt="X2Y2 Logo" />
          </Button>
        </Grid.Col>
        <Grid.Col lg={6}>
          <Button
            as="link"
            size="m"
            color="secondary"
            href={routes.marketplaces.looksrare()}
            target="_blank"
            variant="outlined"
            fullWidth
            onClick={() => onClick("looksrare")}
          >
            <img src="/hellheadz/marketplaces/looksrare-logo.svg" alt="LooksRare Logo" />
          </Button>
        </Grid.Col>
        {/*
        <Grid.Col lg={6}>
          <Button as="link" size="m" color="secondary" href="#" target="_blank" variant="outlined" fullWidth>
            <img src="/hellheadz/marketplaces/blur-logo.png" alt="Blur Logo" />
          </Button>
        </Grid.Col>
        <Grid.Col lg={6}>
          <Button as="link" size="m" color="secondary" href="#" target="_blank" variant="outlined" fullWidth>
            <img src="/hellheadz/marketplaces/superrare-logo.svg" alt="Superrare Logo" />
          </Button>
        </Grid.Col> */}
      </Grid.Row>
    </div>
  );
};
