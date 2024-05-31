import clsx from "clsx";
import { useState } from "react";

import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { Card } from "ui/card/Card";
import metadataBatch0_22 from "providers/svpervnder/hellheadz/metadata-batch-0-22.json";
import { useLarskristoHellheadsContext } from "context/evm/larskristo-hellheads/useLarskristoHellheadsContext";
import { Icon } from "ui/icon/Icon";
import evm from "providers/evm";
import { ERC721Instance } from "providers/evm/ERC721Instance";
import { EtherscanIcon } from "ui/icons/EtherscanIcon";

import styles from "./LarsKristoHellheads.module.scss";
import { ItemMetadata, LatestCollectionProps } from "./LarsKristoHellheads.types";
import { DetailsModal } from "./details-modal/DetailsModal";
import { GridItem } from "./grid-item/GridItem";

export const LarsKristoHellheads: React.FC<LatestCollectionProps> = ({ className }) => {
  const [isDetailsModalVisible, displayDetailsModals] = useState(false);
  const [currentItem, setCurrentItem] = useState<ItemMetadata | undefined>();

  const routes = useRoutes();
  const ERC721 = useLarskristoHellheadsContext();

  const handleExpand = (item: ItemMetadata) => {
    setCurrentItem(item);
    displayDetailsModals(true);
  };

  const handleClose = () => {
    displayDetailsModals(false);
  };

  return (
    <>
      <div className={clsx(styles["latest-collection"], className)}>
        <Grid.Container>
          {/* <section className={clsx(styles["latest-collection__hero--logo"], styles["latest-collection__hero"])}>
            <Grid.Row>
              <Grid.Col lg={6} sm={12} xs={12}>
                <HellheadzLogo className={styles["latest-collection__hellheadz-logo"]} />
              </Grid.Col>
            </Grid.Row>
          </section> */}
          <section className={styles["latest-collection__hero"]}>
            <Typography.Headline1 className={styles["latest-collection__intro--artist-name"]}>
              Larskristo Hellheadz, LK💀💀
            </Typography.Headline1>
            <Grid.Row>
              <Grid.Col lg={6} sm={12} xs={12}>
                <div className={styles["latest-collection__stats"]}>
                  <Typography.Description
                    className={clsx(
                      styles["latest-collection__stats--sub"],
                      styles["latest-collection__stats--sub-minted"],
                    )}
                  >
                    {ERC721.contractValues?.totalSupply}/{ERC721.contractValues?.tokenLimit} <span>Minted</span>
                  </Typography.Description>
                </div>
                <Typography.Text className={styles["latest-collection__description"]}>
                  In 2022, Larskristo ventured deeper into the abyss, exploring the unsettling terrain of AI dark art.
                  This foray birthed Hellheadz — a chilling fusion of the ordinary and the grotesque. Here, everyday
                  objects metamorphosed into eerie spectacles, blurring the lines between reality and nightmare.
                </Typography.Text>
                <div className={styles["latest-collection__socials"]}>
                  <div>
                    <Button color="secondary" size="s" variant="outlined" as="link" href={routes.artists.larskristo()}>
                      About Larskristo
                    </Button>
                  </div>
                  <div className={styles["latest-collection__socials--links"]}>
                    <Typography.Link
                      className={clsx(styles["latest-collection__socials--link"])}
                      href={`${evm.getBlockExplorerUrl()}/address/${ERC721Instance.defaultContractAddress}`}
                      target="_blank"
                    >
                      <EtherscanIcon className={styles["latest-collection__socials--etherscan-icon"]} />
                    </Typography.Link>
                    <Typography.Link
                      className={clsx(styles["latest-collection__socials--link"])}
                      href="https://discord.gg/uEngc5U5"
                      target="_blank"
                    >
                      <Icon name="icon-discord" />
                    </Typography.Link>
                  </div>
                </div>
              </Grid.Col>
            </Grid.Row>
          </section>
        </Grid.Container>

        <Grid.Container>
          <section className={styles["latest-collection__grid"]}>
            <Grid.Row>
              {metadataBatch0_22.map((item: ItemMetadata, index) => (
                <>
                  {index === 6 && (
                    <Grid.Col lg={8} className={styles["latest-collection__grid--info-card-col"]} key="order-matters">
                      <Card withInnerBorder>
                        <Card.Content className={styles["latest-collection__grid--info-card"]}>
                          <Typography.TextLead>Order Matters</Typography.TextLead>
                          <Typography.Headline3 flat>
                            Dark Clown is the first 💀💀, made in early 2022's.
                          </Typography.Headline3>
                        </Card.Content>
                      </Card>
                    </Grid.Col>
                  )}

                  {index === 14 && (
                    <Grid.Col lg={4} className={styles["latest-collection__grid--info-card-col"]} key="order-matters">
                      <Card withInnerBorder>
                        <Card.Content className={styles["latest-collection__grid--info-card"]}>
                          <Typography.TextLead>Scarcity Is Hell</Typography.TextLead>
                          <Typography.Headline3>666 LK💀💀 Topz</Typography.Headline3>
                          <Typography.Description flat>with 22 every month.</Typography.Description>
                        </Card.Content>
                      </Card>
                    </Grid.Col>
                  )}

                  <GridItem key={item.id} item={item} handleExpand={handleExpand} />

                  {item.id === 21 && (
                    <Grid.Col
                      lg={4}
                      className={clsx(styles["latest-collection__grid--info-card-col"])}
                      key="token-limit"
                    >
                      <Card withInnerBorder withBackgroundGrain>
                        <Card.Content
                          className={clsx(
                            styles["latest-collection__grid--info-card"],
                            styles["latest-collection__grid--info-card-light"],
                          )}
                        >
                          <Typography.Description>Hellheadz Owners Only</Typography.Description>
                          <Typography.Headline5>JOIN DISCORD'S PRIVATE CHANNEL</Typography.Headline5>
                          <div>
                            <Button
                              as="link"
                              href={routes.oauth.discord.lkhh()}
                              rightIcon={<Icon name="icon-discord" />}
                              color="dark"
                              variant="outlined"
                            >
                              Verify Ownership
                            </Button>
                          </div>
                        </Card.Content>
                      </Card>
                    </Grid.Col>
                  )}
                </>
              ))}
            </Grid.Row>
          </section>
        </Grid.Container>
      </div>

      {isDetailsModalVisible && <DetailsModal onClose={handleClose} item={currentItem!} />}
    </>
  );
};
