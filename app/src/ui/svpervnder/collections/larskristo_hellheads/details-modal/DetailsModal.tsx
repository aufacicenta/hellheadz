import clsx from "clsx";
import { useEffect, useState } from "react";
import { useEnsName } from "wagmi";

import { Modal } from "ui/modal/Modal";
import { Typography } from "ui/typography/Typography";
import { Grid } from "ui/grid/Grid";
import { Card } from "ui/card/Card";
import { Button } from "ui/button/Button";
import { useLarskristoHellheadsContext } from "context/evm/larskristo-hellheads/useLarskristoHellheadsContext";

import { DetailsModalProps } from "./DetailsModal.types";
import styles from "./DetailsModal.module.scss";

export const DetailsModal: React.FC<DetailsModalProps> = ({ onClose, className, item }) => {
  const [owner, setOwner] = useState<`0x${string}`>();

  const { contractAddress, contractValues, ownerOf } = useLarskristoHellheadsContext();
  const { data: ensName } = useEnsName({ address: owner });

  useEffect(() => {
    (async () => {
      const o = await ownerOf(item.id!);
      setOwner(o);
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
          <div>
            <Button variant="outlined" color="secondary" size="xs">
              Token ID: {item.id!}
            </Button>
          </div>
        </div>
        <Typography.TextLead flat>
          {contractValues?.name}, {contractValues?.symbol}
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
                        1.5 <span>ETH | $3,000</span>
                      </Typography.Headline4>
                    </div>
                    <div>
                      <Typography.Text flat truncate className={styles["details-modal__price-block--owner-pill"]}>
                        <span>Owned by:</span> <Typography.Anchor>{ensName || owner}</Typography.Anchor>
                      </Typography.Text>
                    </div>
                  </div>
                  <div>
                    <Button fullWidth>Buy for: 1.5 ETH</Button>
                  </div>
                </Card.Content>
              </Card>
              <Card className={styles["details-modal__author-card"]}>
                <Card.Content>
                  <Typography.Headline5>About The Author</Typography.Headline5>
                  <Typography.Text>{item.description}</Typography.Text>
                </Card.Content>
              </Card>
              <Card className={styles["details-modal__details-card"]}>
                <Card.Content>
                  <Typography.Headline5>Details</Typography.Headline5>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Contract Address</Typography.Text>
                    <Typography.Anchor truncate>{contractAddress}</Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Token ID</Typography.Text>
                    <Typography.Anchor>{item.id!}</Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Token Standard</Typography.Text>
                    <Typography.Anchor>ERC721</Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Owner</Typography.Text>
                    <Typography.Anchor>{ensName || owner}</Typography.Anchor>
                  </div>
                  <div className={styles["details-modal__details-card--row"]}>
                    <Typography.Text flat>Royalty</Typography.Text>
                    <Typography.Anchor>1%</Typography.Anchor>
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
