import clsx from "clsx";
import { useEffect } from "react";
import { useAccount, useEnsName } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";

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
  const { open } = useWeb3Modal();
  const { isConnected } = useAccount();

  const handleOnDisplayWidgetClick = () => {
    if (isConnected) {
      open({ view: "Account" });
    } else {
      open();
    }
  };

  const handleOnBuyNowClick = () => {
    ERC721.buyToken(item.id!);
  };

  useEffect(() => {
    (async () => {
      await ERC721.ownerOf(item.id!);
      await ERC721.getTokenPrice(item.id!);
    })();
  }, [item.id]);

  useEffect(() => {
    if (!ERC721.tokenPrice?.rawValue) return;

    (async () => {
      await ERC721.royaltyInfo(item.id!);
    })();
  }, [ERC721.tokenPrice?.rawValue]);

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
          <div>
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
              {/* <Typography.Headline5>Description</Typography.Headline5>
            <Typography.Text>{item.description}</Typography.Text> */}
            </Grid.Col>
            <Grid.Col lg={6}>
              <Card className={styles["details-modal__price-card"]}>
                <Card.Content>
                  <div className={styles["details-modal__price-block"]}>
                    <div>
                      <Typography.Headline5 flat>Price</Typography.Headline5>
                      <Typography.Headline4 className={styles["details-modal__price-block--price"]}>
                        {ERC721.tokenPrice?.formattedValue}{" "}
                        <span>ETH | {ERC721.tokenPrice?.exchangeRateFormatted}</span>
                      </Typography.Headline4>
                    </div>
                    <div>
                      <Typography.Text flat truncate className={styles["details-modal__price-block--owner-pill"]}>
                        <span>Owned by:</span> <Typography.Anchor>{ensName || ERC721.owner}</Typography.Anchor>
                      </Typography.Text>
                    </div>
                  </div>
                  {!isConnected && (
                    <div className={styles["details-modal__price-block--connect-wallet"]}>
                      <Button fullWidth variant="outlined" onClick={handleOnDisplayWidgetClick}>
                        Connect Wallet
                      </Button>
                    </div>
                  )}
                  <div className={styles["details-modal__price-block--buy-now"]}>
                    <Button
                      fullWidth
                      disabled={!isConnected || ERC721.actions.buyToken.isPending}
                      onClick={handleOnBuyNowClick}
                      isLoading={ERC721.actions.buyToken.isPending}
                    >
                      Buy for: {ERC721.tokenPrice?.formattedValue} ETH
                    </Button>
                  </div>
                  {ERC721.actions.buyToken.isConfirmed && (
                    <div className={styles["details-modal__price-block--success"]}>
                      {ERC721.actions.buyToken.isConfirmed && (
                        <Typography.Text flat>
                          Purchase confirmed! Check your transaction{" "}
                          <Typography.Anchor
                            href={`${evm.getBlockExplorerUrl()}/tx/${ERC721.actions.buyToken.transactionHash}`}
                          >
                            here <Icon name="icon-exit-up2" />
                          </Typography.Anchor>
                        </Typography.Text>
                      )}
                    </div>
                  )}
                </Card.Content>
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
                  <Grid.Row justify="end">
                    <Grid.Col lg={1}>
                      <Typography.Anchor>
                        <Icon name="icon-instagram" />
                      </Typography.Anchor>
                    </Grid.Col>
                    <Grid.Col lg={1}>
                      <Typography.Anchor>
                        <Icon name="icon-tiktok" />
                      </Typography.Anchor>
                    </Grid.Col>
                  </Grid.Row>
                </Card.Content>
              </Card>
              <Card className={styles["details-modal__details-card"]}>
                <Card.Content>
                  <Typography.Headline5>Details</Typography.Headline5>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Contract Address</Typography.Text>
                    <Typography.Anchor truncate>{ERC721.contractAddress}</Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Token ID</Typography.Text>
                    <Typography.Anchor>#{item.id!}</Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Token Standard</Typography.Text>
                    <Typography.Anchor>ERC721</Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Owner</Typography.Text>
                    <Typography.Anchor truncate>{ensName || ERC721.owner}</Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Royalty</Typography.Text>
                    <Typography.Anchor>{ERC721.royalty?.percentageFormatted}</Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Chain</Typography.Text>
                    <Typography.Anchor>Ethereum</Typography.Anchor>
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
