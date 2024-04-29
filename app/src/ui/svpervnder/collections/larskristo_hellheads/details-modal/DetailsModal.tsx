import clsx from "clsx";
import { Field, Form as RFForm } from "react-final-form";
import { useEffect, useRef, useState } from "react";
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

const handleOnSetTokenPriceSubmit = (values: Record<string, string>) => {
  console.log({ values });
};

export const DetailsModal: React.FC<DetailsModalProps> = ({ onClose, className, item }) => {
  const [isSetForSale, setIsSetForSale] = useState(false);
  const tokenPriceInputRef = useRef<HTMLInputElement | undefined>();

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

  const handleSetForSaleToggle = () => {
    setIsSetForSale(!isSetForSale);
    setTimeout(() => {
      tokenPriceInputRef.current?.focus();
    }, 500);
  };

  useEffect(() => {
    (async () => {
      await ERC721.ownerOf(item.id!);
      await ERC721.getTokenPrice(item.id!);
    })();
  }, [item.id, ERC721.actions.buyToken.isConfirmed]);

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
              {/* <Typography.Headline5>Description</Typography.Headline5>
            <Typography.Text>{item.description}</Typography.Text> */}
            </Grid.Col>
            <Grid.Col lg={6}>
              <RFForm
                onSubmit={handleOnSetTokenPriceSubmit}
                render={({ handleSubmit }) => (
                  <Card className={styles["details-modal__price-card"]}>
                    <Card.Content>
                      <div className={styles["details-modal__price-block"]}>
                        <div>
                          <Typography.Headline5 flat>Price</Typography.Headline5>
                          {!ERC721.tokenPrice ? (
                            <Typography.Description>Not for sale yet.</Typography.Description>
                          ) : (
                            <Typography.Headline4 className={styles["details-modal__price-block--price"]}>
                              {ERC721.tokenPrice?.formattedValue}{" "}
                              <span>ETH | {ERC721.tokenPrice?.exchangeRateFormatted}</span>
                            </Typography.Headline4>
                          )}
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

                      {isSetForSale && (
                        <div className={styles["details-modal__set-for-sale--form"]}>
                          <Typography.TextLead flat className={styles["details-modal__set-for-sale--form-currency"]}>
                            ETH
                          </Typography.TextLead>
                          <Field
                            name="tokenPrice"
                            component="input"
                            className={clsx("input-field", styles["details-modal__set-for-sale--form-price-field"])}
                            id="message"
                            placeholder="Enter a price"
                            ref={tokenPriceInputRef}
                          />
                        </div>
                      )}

                      {ERC721.connectedAccountIsOwner() && !isSetForSale && !ERC721.actions.buyToken.isConfirmed && (
                        <div className={styles["details-modal__set-for-sale"]}>
                          <div className={styles["details-modal__set-for-sale--info"]}>
                            <Typography.Text flat>You own this item.</Typography.Text>
                          </div>
                        </div>
                      )}

                      {ERC721.actions.buyToken.isConfirmed && (
                        <div className={styles["details-modal__price-block--success"]}>
                          <Typography.Text flat>
                            Purchase confirmed! Check your transaction{" "}
                            <Typography.Anchor
                              href={`${evm.getBlockExplorerUrl()}/tx/${ERC721.actions.buyToken.transactionHash}`}
                            >
                              here <Icon name="icon-exit-up2" />
                            </Typography.Anchor>
                          </Typography.Text>
                        </div>
                      )}
                    </Card.Content>

                    {ERC721.tokenPrice && !ERC721.connectedAccountIsOwner() && (
                      <Card.Actions>
                        <Button
                          fullWidth
                          disabled={!isConnected || ERC721.actions.buyToken.isPending}
                          onClick={handleOnBuyNowClick}
                          isLoading={ERC721.actions.buyToken.isPending}
                        >
                          Buy for: {ERC721.tokenPrice?.formattedValue} ETH
                        </Button>
                      </Card.Actions>
                    )}

                    {ERC721.connectedAccountIsOwner() && !isSetForSale && (
                      <Card.Actions>
                        <Button
                          fullWidth
                          disabled={!isConnected || ERC721.actions.buyToken.isPending}
                          onClick={handleSetForSaleToggle}
                          isLoading={ERC721.actions.buyToken.isPending}
                        >
                          Set For Sale
                        </Button>
                      </Card.Actions>
                    )}

                    {isSetForSale && (
                      <Card.Actions>
                        <Button
                          variant="outlined"
                          color="secondary"
                          disabled={!isConnected}
                          onClick={handleSetForSaleToggle}
                          isLoading={ERC721.actions.buyToken.isPending}
                        >
                          Cancel
                        </Button>
                        <Button
                          color="primary"
                          disabled={!isConnected}
                          isLoading={ERC721.actions.buyToken.isPending}
                          type="submit"
                          onClick={handleSubmit}
                        >
                          Set For Sale
                        </Button>
                      </Card.Actions>
                    )}
                  </Card>
                )}
              />
              <Card className={styles["details-modal__forge-card"]}>
                <Card.Content>
                  <Typography.Headline5>Forge This Item</Typography.Headline5>
                  <Typography.Text flat>Extend this item's story, exclusively for you by Lars Kristo.</Typography.Text>
                  <Typography.Description>
                    * Each forge is also registered in the Ethereum blockchain tied to the original NFT.
                  </Typography.Description>
                  <Grid.Row className={styles["details-modal__forge-card--row"]}>
                    <Grid.Col className={styles["details-modal__forge-card--row-img"]} lg={2}>
                      <img src={item.thumbnail} alt={item.id?.toString()} />
                    </Grid.Col>
                    <Grid.Col className={styles["details-modal__forge-card--row-price"]} lg={6}>
                      <Typography.Text flat>3D Animated Character</Typography.Text>
                      <div className={styles["details-modal__forge-card--row-details"]}>
                        <Typography.Description flat>1.5 ETH</Typography.Description>
                        <Button size="s" variant="text" color="secondary">
                          Learn More
                        </Button>
                      </div>
                    </Grid.Col>
                    <Grid.Col className={styles["details-modal__forge-card--row-button"]} lg={4}>
                      <Button variant="outlined" color="secondary">
                        Forge
                      </Button>
                    </Grid.Col>
                  </Grid.Row>
                  <Grid.Row className={styles["details-modal__forge-card--row"]}>
                    <Grid.Col className={styles["details-modal__forge-card--row-img"]} lg={2}>
                      <img src={item.thumbnail} alt={item.id?.toString()} />
                    </Grid.Col>
                    <Grid.Col className={styles["details-modal__forge-card--row-price"]} lg={6}>
                      <Typography.Text flat>Physical Hellhead Toy</Typography.Text>
                      <div className={styles["details-modal__forge-card--row-details"]}>
                        <Typography.Description flat>1.5 ETH</Typography.Description>
                        <Button size="s" variant="text" color="secondary">
                          Learn More
                        </Button>
                      </div>
                    </Grid.Col>
                    <Grid.Col className={styles["details-modal__forge-card--row-button"]} lg={4}>
                      <Button variant="outlined" color="secondary">
                        Forge
                      </Button>
                    </Grid.Col>
                  </Grid.Row>
                  <Grid.Row className={styles["details-modal__forge-card--row"]}>
                    <Grid.Col className={styles["details-modal__forge-card--row-img"]} lg={2}>
                      <img src={item.thumbnail} alt={item.id?.toString()} />
                    </Grid.Col>
                    <Grid.Col className={styles["details-modal__forge-card--row-price"]} lg={6}>
                      <Typography.Text flat>Physical Hellhead Oil On Canvas</Typography.Text>
                      <div className={styles["details-modal__forge-card--row-details"]}>
                        <Typography.Description flat>1.5 ETH</Typography.Description>
                        <Button size="s" variant="text" color="secondary">
                          Learn More
                        </Button>
                      </div>
                    </Grid.Col>
                    <Grid.Col className={styles["details-modal__forge-card--row-button"]} lg={4}>
                      <Button variant="outlined" color="secondary">
                        Forge
                      </Button>
                    </Grid.Col>
                  </Grid.Row>
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
                  <Grid.Container>
                    <Grid.Row justify="end">
                      <Grid.Col lg={1} xs={1}>
                        <Typography.Anchor>
                          <Icon name="icon-instagram" />
                        </Typography.Anchor>
                      </Grid.Col>
                      <Grid.Col lg={1} xs={1}>
                        <Typography.Anchor>
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
