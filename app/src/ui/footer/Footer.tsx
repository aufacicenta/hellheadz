import clsx from "clsx";

import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { HellheadzLogo } from "ui/icons/HellheadzLogo";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { EtherscanIcon } from "ui/icons/EtherscanIcon";
import { Icon } from "ui/icon/Icon";
import { Button } from "ui/button/Button";
import evm from "providers/evm";
import { ERC721Instance } from "providers/evm/ERC721Instance";
import { useAnalyticsContext } from "context/analytics/useAnalyticsContext";
import analytics from "providers/analytics";
import { AnalyticsEvent } from "context/analytics/AnalyticsContext.types";

import { FooterProps } from "./Footer.types";
import styles from "./Footer.module.scss";

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const routes = useRoutes();
  const AnalyticsContext = useAnalyticsContext();

  const onClick = (event: AnalyticsEvent) => {
    AnalyticsContext.onClick(event);
  };

  return (
    <footer className={clsx(styles.footer, className)}>
      <Grid.Container>
        <Grid.Row>
          <Grid.Col lg={6} sm={6} xs={6}>
            <div className={styles.footer__left}>
              <div className={styles["footer__left--item"]}>
                <Typography.Link
                  flat
                  href={`${routes.home()}#collection`}
                  onClick={() =>
                    onClick({
                      name: analytics.EventTracking.click.footer.navigation,
                      meta: {
                        item: "collection",
                      },
                    })
                  }
                >
                  Collection
                </Typography.Link>
              </div>
              <div className={styles["footer__left--item"]}>
                <Typography.Link
                  flat
                  href={`${routes.home()}#faqs`}
                  onClick={() =>
                    onClick({
                      name: analytics.EventTracking.click.footer.navigation,
                      meta: {
                        item: "faqs",
                      },
                    })
                  }
                >
                  FAQs
                </Typography.Link>
              </div>
              <div className={styles["footer__left--item"]}>
                <Typography.Link
                  flat
                  href={routes.events.index()}
                  onClick={() =>
                    onClick({
                      name: analytics.EventTracking.click.footer.navigation,
                      meta: {
                        item: "events",
                      },
                    })
                  }
                >
                  Events
                </Typography.Link>
              </div>
              <div className={styles["footer__left--item"]}>
                <Typography.Link
                  flat
                  href={routes.artists.larskristo()}
                  onClick={() =>
                    onClick({
                      name: analytics.EventTracking.click.footer.navigation,
                      meta: {
                        item: "about",
                      },
                    })
                  }
                >
                  About
                </Typography.Link>
              </div>
            </div>
          </Grid.Col>
          <Grid.Col lg={6} sm={6} xs={6}>
            <div className={styles.footer__right}>
              <div className={clsx(styles["footer__right--item"], styles["footer__right--item-flat-bottom"])}>
                <Typography.Link href={routes.home()}>
                  <HellheadzLogo className={styles.footer__logo} />
                </Typography.Link>
              </div>
            </div>
          </Grid.Col>
        </Grid.Row>
      </Grid.Container>
      <Grid.Container className={clsx(styles.footer__bottom)}>
        <Grid.Row>
          <Grid.Col lg={6} sm={6} xs={6}>
            <div className={clsx(styles.footer__left, styles.footer__socials)}>
              <div className={styles["footer__socials--links"]}>
                <Typography.Link
                  className={clsx(styles["footer__socials--link"])}
                  href={routes.socials.discord}
                  target="_blank"
                  onClick={() =>
                    onClick({ name: analytics.EventTracking.click.footer.socials, meta: { item: "discord" } })
                  }
                >
                  <Icon name="icon-discord" />
                </Typography.Link>
                <Button
                  variant="outlined"
                  size="s"
                  color="secondary"
                  as="link"
                  href={`${evm.getBlockExplorerUrl()}/token/${ERC721Instance.defaultContractAddress}`}
                  target="_blank"
                  leftIcon={<EtherscanIcon className={styles["footer__socials--etherscan-icon"]} />}
                  onClick={() =>
                    onClick({ name: analytics.EventTracking.click.footer.socials, meta: { item: "etherscan" } })
                  }
                >
                  LK💀💀
                </Button>
              </div>
            </div>
          </Grid.Col>
          <Grid.Col lg={6} sm={6} xs={6}>
            <div className={styles.footer__right}>
              <div className={clsx(styles["footer__right--item"], styles["footer__right--item-flat"])}>
                <Typography.MiniDescription flat>
                  {new Date().getFullYear()}. All Rights Reserved
                </Typography.MiniDescription>
              </div>
            </div>
          </Grid.Col>
        </Grid.Row>
      </Grid.Container>
    </footer>
  );
};
