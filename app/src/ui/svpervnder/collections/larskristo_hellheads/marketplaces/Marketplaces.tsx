import clsx from "clsx";

import { Grid } from "ui/grid/Grid";
import { Button } from "ui/button/Button";
import { useRoutes } from "hooks/useRoutes/useRoutes";

import styles from "./Marketplaces.module.scss";
import { MarketplacesProps } from "./Marketplaces.types";

export const Marketplaces: React.FC<MarketplacesProps> = ({ className }) => {
  const routes = useRoutes();

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
          >
            <img src="/hellheadz/marketplaces/x2y2-logo.svg" alt="X2Y2 Logo" />
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
