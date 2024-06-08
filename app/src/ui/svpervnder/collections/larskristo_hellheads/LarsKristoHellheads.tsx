import clsx from "clsx";
import { useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { Card } from "ui/card/Card";
import metadataBatch0_22 from "providers/svpervnder/hellheadz/metadata-batch-0-22.json";
import { Icon } from "ui/icon/Icon";
import { Accordion } from "ui/accordion/Accordion";

import styles from "./LarsKristoHellheads.module.scss";
import { ItemMetadata, LatestCollectionProps } from "./LarsKristoHellheads.types";
import { DetailsModal } from "./details-modal/DetailsModal";
import { GridItem } from "./grid-item/GridItem";
import { Marketplaces } from "./marketplaces/Marketplaces";

export const LarsKristoHellheads: React.FC<LatestCollectionProps> = ({ className }) => {
  const [isDetailsModalVisible, displayDetailsModals] = useState(false);
  const [currentItem, setCurrentItem] = useState<ItemMetadata | undefined>();

  const routes = useRoutes();

  const handleExpand = (item: ItemMetadata) => {
    setCurrentItem(item);
    displayDetailsModals(true);
  };

  const handleClose = () => {
    displayDetailsModals(false);
  };

  useLayoutEffect(() => {
    gsap.config({});

    gsap.registerPlugin(ScrollTrigger);

    const split = document.querySelectorAll(".intro-text");

    const masks: HTMLSpanElement[] = [];

    function makeItHappen() {
      split.forEach((target) => {
        const mask = document.createElement("span");

        mask.className = "mask";
        target.append(mask);
        masks.push(mask);

        gsap.to(mask, {
          scaleX: 0,
          transformOrigin: "right center",
          ease: "circ.in",
          scrollTrigger: {
            trigger: target,
            markers: false,
            scrub: 0.5,
            start: `-=700`,
            end: "bottom center",
          },
        });
      });
    }

    function newTriggers() {
      ScrollTrigger.getAll().forEach((trigger, i) => {
        trigger.kill();
        masks[i].remove();
      });

      makeItHappen();
    }

    window.addEventListener("resize", newTriggers);

    makeItHappen();
  }, []);

  return (
    <>
      <div className={clsx(styles["latest-collection"], className)}>
        <div className={styles["latest-collection__bg-img"]} />
        <Grid.Container>
          <Grid.Row justify="center">
            <Grid.Col lg={10}>
              <section
                className={clsx(styles["latest-collection__hero"], styles["latest-collection__hero--intro-text"])}
              >
                <Typography.Headline2 className="intro-text">
                  In 2022, <span>Larskristo</span> ventured deeper into the abyss, exploring the unsettling terrain of
                  digital art.
                </Typography.Headline2>
              </section>
              <section
                className={clsx(styles["latest-collection__hero"], styles["latest-collection__hero--intro-text"])}
              >
                <Typography.Headline2 className="intro-text">
                  This foray birthed <span>Hellheadz</span> —
                </Typography.Headline2>
                <Typography.Headline2 className="intro-text">a chilling fusion</Typography.Headline2>
                <Typography.Headline2 className="intro-text">
                  <span>of the ordinary and the grotesque.</span>
                </Typography.Headline2>
              </section>
              <section
                className={clsx(styles["latest-collection__hero"], styles["latest-collection__hero--intro-text"])}
              >
                <Typography.Headline2 className="intro-text">
                  666 NFT's <span>immortalized</span>
                </Typography.Headline2>
                <Typography.Headline2 className="intro-text">in the Ethereum blockchain.</Typography.Headline2>
              </section>
              <section
                className={clsx(styles["latest-collection__hero"], styles["latest-collection__hero--intro-text"])}
              >
                <Typography.Headline2 className="intro-text" flat>
                  Here, everyday objects
                </Typography.Headline2>
                <Typography.Headline2 className="intro-text">
                  <span>metamorphosed into eerie spectacles,</span>{" "}
                </Typography.Headline2>
              </section>
              <section
                className={clsx(
                  styles["latest-collection__hero"],
                  styles["latest-collection__hero--intro-text"],
                  styles["latest-collection__hero--intro-text-last"],
                )}
              >
                <Typography.Headline2
                  className={clsx(
                    "intro-text",
                    styles["latest-collection__hero--intro-text-highlight"],
                    styles["latest-collection__hero--intro-text-highlight-top"],
                  )}
                  flat
                >
                  BLURRING THE LINES
                </Typography.Headline2>
                <Typography.Headline2
                  className={clsx("intro-text", styles["latest-collection__hero--intro-text-highlight"])}
                >
                  BETWEEN REALITY AND NIGHTMARE.
                </Typography.Headline2>
              </section>
            </Grid.Col>
          </Grid.Row>
        </Grid.Container>

        <Grid.Container>
          <section className={styles["latest-collection__grid"]} id="collection">
            <div className={styles["latest-collection__grid--currency-intro"]}>
              <Image
                width={1077}
                height={683}
                src="/hellheadz/hellheadz-currency-logo.png"
                alt="Hellehadz: The World's Darkest Currency"
              />
            </div>
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

        <Grid.Container>
          <section className={styles["latest-collection__faqs"]} id="faqs">
            <Grid.Row justify="center">
              <Grid.Col lg={8}>
                <Typography.Headline2 className={styles["latest-collection__faqs--title"]}>
                  Frequently Asked Questions
                </Typography.Headline2>
                <Accordion
                  accordionHeader={<Typography.Headline3 flat>What in the hell is this, exactly?</Typography.Headline3>}
                  accordionContent={
                    <>
                      <Typography.Text>
                        Larskristo Hellheadz is an NFT collection. It is a series of digital artwork created by the
                        author Lars Kristo and it is backed and secured by an ERC721 contract in the Ethereum blockchain
                        mainnet.
                      </Typography.Text>
                      <Typography.Text flat>
                        Hellheadz also gives you access to exclusive events and physical items made by the artist.
                      </Typography.Text>
                    </>
                  }
                />
                <Accordion
                  accordionHeader={<Typography.Headline3 flat>Where can I purchase a Hellhead?</Typography.Headline3>}
                  accordionContent={
                    <>
                      <Typography.Text>Hellheadz are currently listed in these marketplaces:</Typography.Text>
                      <Marketplaces />
                    </>
                  }
                />
                <Accordion
                  accordionHeader={
                    <Typography.Headline3 flat>I already own a Hellhead, what now?</Typography.Headline3>
                  }
                  accordionContent={
                    <>
                      <Typography.Text>
                        Decide on the future of Hellheadz in the owners-only Discord channel.
                      </Typography.Text>
                      <Button
                        as="link"
                        href={routes.oauth.discord.lkhh()}
                        rightIcon={<Icon name="icon-discord" />}
                        color="primary"
                        variant="outlined"
                      >
                        Verify Ownership
                      </Button>
                    </>
                  }
                />
                <Accordion
                  accordionHeader={
                    <Typography.Headline3 flat>Can I sell back a Hellhead anytime?</Typography.Headline3>
                  }
                  accordionContent={
                    <>
                      <Typography.Text>
                        Yes. In the same marketplace you chose to buy your Hellhead originally, you can list it back and
                        resell it a your desired price.
                      </Typography.Text>
                      <Typography.Text flat>In other words, Hellheadz are tradeable collectibles.</Typography.Text>
                    </>
                  }
                />
                <Accordion
                  accordionHeader={<Typography.Headline3 flat>How many of them will there be?</Typography.Headline3>}
                  accordionContent={
                    <>
                      <Typography.Text>666 only until the doom of time.</Typography.Text>
                      <Typography.Text flat>With 22 minted each month.</Typography.Text>
                    </>
                  }
                />
                <Accordion
                  accordionHeader={<Typography.Headline3 flat>Am I a Hellhead?</Typography.Headline3>}
                  accordionContent={
                    <>
                      <Typography.Text flat>... I don't know, are you?</Typography.Text>
                    </>
                  }
                />
              </Grid.Col>
            </Grid.Row>
          </section>
        </Grid.Container>
      </div>

      {isDetailsModalVisible && <DetailsModal onClose={handleClose} item={currentItem!} />}
    </>
  );
};
