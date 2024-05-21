import clsx from "clsx";
import { useEffect } from "react";
import { useEnsName } from "wagmi";

import { Modal } from "ui/modal/Modal";
import { Typography } from "ui/typography/Typography";
import { Grid } from "ui/grid/Grid";
import { Card } from "ui/card/Card";
import { Button } from "ui/button/Button";
import { useLarskristoHellheadsContext } from "context/evm/larskristo-hellheads/useLarskristoHellheadsContext";
import { Icon } from "ui/icon/Icon";
import evm from "providers/evm";

import { DetailsModalProps } from "./DetailsModal.types";
import styles from "./DetailsModal.module.scss";

export const DetailsModal: React.FC<DetailsModalProps> = ({ onClose, className, item }) => {
  const ERC721 = useLarskristoHellheadsContext();
  const { data: ensName } = useEnsName({ address: ERC721.owner });

  useEffect(() => {
    (async () => {
      await ERC721.ownerOf(item.id!);
    })();
  }, [item.id]);

  return (
    <Modal
      className={clsx(styles["details-modal"], className)}
      isOpened
      size="l"
      fullscreenVariant="default"
      aria-labelledby="Lars Kristo Hellheads Modal Window"
      onClose={onClose}
    >
      <Modal.Header onClose={onClose}>
        <div className={styles["details-modal__header--row"]}>
          <div>
            <Typography.Headline4 flat>{item.name} </Typography.Headline4>
          </div>
          <div className={styles["details-modal__header--token-id"]}>
            <Button variant="outlined" color="secondary" size="xs">
              Token ID: {item.id!}
            </Button>
          </div>
        </div>
        <Typography.TextLead flat>
          {ERC721.contractValues?.name}, {ERC721.contractValues?.symbol}
        </Typography.TextLead>
      </Modal.Header>
      <Modal.Content>
        <Grid.Container>
          <Grid.Row>
            <Grid.Col lg={6}>
              <div className={styles["details-modal__img-container"]}>
                <img src={item.image} alt={item.name} />
              </div>
            </Grid.Col>
            <Grid.Col lg={6}>
              <Card className={styles["details-modal__price-card"]}>
                <Card.Content>
                  <div className={styles["details-modal__price-block"]}>
                    <div>
                      <Typography.Headline5>About This Item</Typography.Headline5>
                    </div>
                    <div>
                      <Typography.Text flat truncate className={styles["details-modal__price-block--owner-pill"]}>
                        <span>Owned by:</span>{" "}
                        <Typography.Anchor
                          href={`${evm.getBlockExplorerUrl()}/address/${ensName || ERC721.owner}`}
                          target="_blank"
                        >
                          {ensName || ERC721.owner}
                        </Typography.Anchor>
                      </Typography.Text>
                    </div>
                  </div>

                  <Typography.Text>{item.description}</Typography.Text>

                  {ERC721.connectedAccountIsOwner() && (
                    <div className={styles["details-modal__set-for-sale"]}>
                      <div className={styles["details-modal__set-for-sale--info"]}>
                        <Typography.Text flat>You own this item.</Typography.Text>
                      </div>
                    </div>
                  )}
                </Card.Content>

                {!ERC721.connectedAccountIsOwner() && (
                  <Card.Actions className={styles["details-modal__actions--buy-now-buttons"]}>
                    <Button
                      as="link"
                      href="#"
                      target="_blank"
                      variant="outlined"
                      rightIcon={<Icon name="icon-launch" />}
                    >
                      Buy now in OpenSea
                    </Button>
                    <Button
                      as="link"
                      href="#"
                      target="_blank"
                      variant="outlined"
                      rightIcon={<Icon name="icon-launch" />}
                    >
                      Buy now in MagicEden
                    </Button>
                  </Card.Actions>
                )}
              </Card>
              <Card className={styles["details-modal__author-card"]}>
                <Card.Content>
                  <Typography.Headline5>About The Author</Typography.Headline5>
                  <Typography.Text>
                    Larskristo's artistic journey began with a quiet intensity, delving into the shadows where emotions
                    lie in their rawest form. His early works were haunting glimpses into the human soul, capturing the
                    delicate balance between vulnerability and resilience.
                  </Typography.Text>
                  <Typography.Text>
                    In 2022, Larskristo ventured deeper into the abyss, exploring the unsettling terrain of AI dark art.
                    This foray birthed HellheadS—a chilling fusion of the ordinary and the grotesque. Here, everyday
                    objects metamorphosed into eerie spectacles, blurring the lines between reality and nightmare.
                  </Typography.Text>
                  <Grid.Container>
                    <Grid.Row justify="end">
                      <Grid.Col lg={1} xs={1}>
                        <Typography.Anchor href="https://instagram.com/larskristo" target="_blank">
                          <Icon name="icon-instagram" />
                        </Typography.Anchor>
                      </Grid.Col>
                      <Grid.Col lg={1} xs={1}>
                        <Typography.Anchor href="https://www.tiktok.com/@larskristo" target="_blank">
                          <Icon name="icon-tiktok" />
                        </Typography.Anchor>
                      </Grid.Col>
                    </Grid.Row>
                  </Grid.Container>
                </Card.Content>
              </Card>
              <Card className={styles["details-modal__details-card"]}>
                <Card.Content>
                  <Typography.Headline5>Details</Typography.Headline5>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Contract Address</Typography.Text>
                    <Typography.Anchor
                      truncate
                      href={`${evm.getBlockExplorerUrl()}/token/${ERC721.contractAddress}`}
                      target="_blank"
                      className={styles["details-modal__details-card--row-right"]}
                    >
                      {ERC721.contractAddress}
                    </Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Token ID</Typography.Text>
                    <Typography.Anchor
                      href={`${evm.getBlockExplorerUrl()}/nft/${ERC721.contractAddress}/${item.id!}`}
                      target="_blank"
                      className={styles["details-modal__details-card--row-right"]}
                    >
                      #{item.id!}
                    </Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Token Standard</Typography.Text>
                    <Typography.Anchor className={styles["details-modal__details-card--row-right"]}>
                      ERC721
                    </Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Owner</Typography.Text>
                    <Typography.Anchor
                      truncate
                      href={`${evm.getBlockExplorerUrl()}/address/${ensName || ERC721.owner}`}
                      target="_blank"
                      className={styles["details-modal__details-card--row-right"]}
                    >
                      {ensName || ERC721.owner}
                    </Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Chain</Typography.Text>
                    <Typography.Text flat className={styles["details-modal__details-card--row-right"]}>
                      Ethereum
                    </Typography.Text>
                  </div>
                </Card.Content>
              </Card>
            </Grid.Col>
          </Grid.Row>
        </Grid.Container>
      </Modal.Content>
    </Modal>
  );
};
