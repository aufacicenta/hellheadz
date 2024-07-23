import clsx from "clsx";
import { useEffect, useState } from "react";
import { useEnsName } from "wagmi";
import { mainnet } from "viem/chains";

import text from "../../../../../theme/utilities/text.module.scss";
import { Modal } from "ui/modal/Modal";
import { Typography } from "ui/typography/Typography";
import { Grid } from "ui/grid/Grid";
import { Card } from "ui/card/Card";
import { useLarskristoHellheadsContext } from "context/evm/larskristo-hellheads/useLarskristoHellheadsContext";
import { Icon } from "ui/icon/Icon";
import evm from "providers/evm";
import { ZeroXAddress } from "context/evm/wallet-selector/EvmWalletSelectorContext.types";
import { ERC721Instance } from "providers/evm/ERC721Instance";
import { TokenMetadata } from "providers/evm/ERC721Instance.types";
import { Marketplaces } from "../marketplaces/Marketplaces";

import { DetailsModalProps } from "./DetailsModal.types";
import styles from "./DetailsModal.module.scss";

export const DetailsModal: React.FC<DetailsModalProps> = ({ onClose, className, item }) => {
  const [metadata, setMetadata] = useState<TokenMetadata | undefined>();

  const ERC721 = useLarskristoHellheadsContext();

  const { data: ownerEnsName } = useEnsName({ address: ERC721.owner, chainId: mainnet.id });

  const { data: authorEnsName } = useEnsName({
    address: ERC721.contractValues?.author as ZeroXAddress,
    chainId: mainnet.id,
  });

  useEffect(() => {
    if (!ERC721.contract) return;

    (async () => {
      const tokenURI = await ERC721.tokenURI(item.id);
      console.log({ tokenURI });
      const result = await ERC721Instance.getTokenMetadata(tokenURI.replaceAll(" ", ""));

      setMetadata(result?.data);
    })();
  }, [item.id, ERC721.contract]);

  useEffect(() => {
    (async () => {
      await ERC721.ownerOf(item.id!);
    })();
  }, [item.id, ERC721.contract]);

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
            <Typography.Headline4 flat className={clsx(text["text__color--typography-text"])}>
              {metadata?.name}{" "}
            </Typography.Headline4>
          </div>
          <div className={styles["details-modal__header--token-id"]}>
            <Typography.Link
              href={`${evm.getBlockExplorerUrl()}/nft/${ERC721.contract?.address}/${metadata?.id}`}
              target="_blank"
              flat
            >
              Token ID: {metadata?.id!}
            </Typography.Link>
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
                <img src={metadata?.image} alt={metadata?.name} />
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
                      <Typography.Text flat className={styles["details-modal__price-block--owner-pill"]}>
                        <span>Owned by:</span>{" "}
                        <Typography.Anchor
                          href={`${evm.getBlockExplorerUrl()}/address/${ownerEnsName || ERC721.owner}`}
                          target="_blank"
                        >
                          {ownerEnsName || evm.format.truncate(ERC721.owner!)}
                        </Typography.Anchor>
                      </Typography.Text>
                    </div>
                  </div>

                  <Typography.Text>{metadata?.description}</Typography.Text>

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
                    <Typography.Headline5>Buy Now</Typography.Headline5>
                    <Marketplaces />
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
                      href={`${evm.getBlockExplorerUrl()}/token/${ERC721.contract?.address}`}
                      target="_blank"
                      className={styles["details-modal__details-card--row-right"]}
                    >
                      {evm.format.truncate(ERC721.contract?.address)}
                    </Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Author</Typography.Text>
                    <Typography.Anchor
                      href={`${evm.getBlockExplorerUrl()}/address/${ERC721.contractValues?.author}`}
                      target="_blank"
                      className={styles["details-modal__details-card--row-right"]}
                    >
                      {authorEnsName || evm.format.truncate(ERC721.contractValues?.author!)}
                    </Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Token ID</Typography.Text>
                    <Typography.Anchor
                      href={`${evm.getBlockExplorerUrl()}/nft/${ERC721.contract?.address}/${item.id!}`}
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
                      href={`${evm.getBlockExplorerUrl()}/address/${ownerEnsName || ERC721.owner}`}
                      target="_blank"
                      className={styles["details-modal__details-card--row-right"]}
                    >
                      {ownerEnsName || evm.format.truncate(ERC721.owner!)}
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
