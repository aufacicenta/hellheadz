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

import { FooterProps } from "./Footer.types";
import styles from "./Footer.module.scss";

export const Footer: React.FC<FooterProps> = ({ className }) => {
  const routes = useRoutes();

  return (
    <footer className={clsx(styles.footer, className)}>
      <Grid.Container>
        <Grid.Row>
          <Grid.Col lg={6} sm={6} xs={6}>
            <div className={styles.footer__left}>
              <div className={styles["footer__left--item"]}>
                <Typography.Link flat href={`${routes.home()}#collection`}>
                  Collection
                </Typography.Link>
              </div>
              <div className={styles["footer__left--item"]}>
                <Typography.Link flat href={`${routes.home()}#faqs`}>
                  FAQs
                </Typography.Link>
              </div>
              <div className={styles["footer__left--item"]}>
                <Typography.Link flat href="#">
                  Events
                </Typography.Link>
              </div>
              <div className={styles["footer__left--item"]}>
                <Typography.Link flat href={routes.artists.larskristo()}>
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
      <Grid.Container>
        <Grid.Row>
          <Grid.Col lg={6} sm={6} xs={6}>
            <div className={clsx(styles.footer__left, styles.footer__socials)}>
              <div className={styles["footer__socials--links"]}>
                <Typography.Link
                  className={clsx(styles["footer__socials--link"])}
                  href="https://discord.gg/xZuhTDTef3"
                  target="_blank"
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
