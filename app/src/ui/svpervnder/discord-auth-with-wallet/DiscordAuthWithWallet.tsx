import clsx from "clsx";
import { useAccount, useSignMessage } from "wagmi";
import { useWeb3Modal } from "@web3modal/wagmi/react";
import { useEffect, useState } from "react";
import axios from "axios";

import spacing from "../../../theme/utilities/spacing.module.scss";
import text from "../../../theme/utilities/text.module.scss";
import { Grid } from "ui/grid/Grid";
import { Typography } from "ui/typography/Typography";
import { Button } from "ui/button/Button";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { Card } from "ui/card/Card";
import { useDiscordContext } from "context/discord/useDiscordContext";
import { ERC721Instance } from "providers/evm/ERC721Instance";
import evm from "providers/evm";
import { Icon } from "ui/icon/Icon";

import { DiscordAuthWithWalletProps } from "./DiscordAuthWithWallet.types";
import styles from "./DiscordAuthWithWallet.module.scss";

export const DiscordAuthWithWallet: React.FC<DiscordAuthWithWalletProps> = ({ className }) => {
  const [ownershipVerification, setOwnershipVerification] = useState({
    isVerifyingSignature: false,
    isSignatureVerified: false,
    isSignatureSent: false,
    isOwner: false,
  });
  const [message, setMessage] = useState<string>("");

  const routes = useRoutes();
  const walletContext = useAccount();
  const discordContext = useDiscordContext();
  const web3Modal = useWeb3Modal();

  const { data: signMessageData, error: signMessageError, signMessage } = useSignMessage();

  useEffect(() => {
    setMessage(
      `My Discord username is ${discordContext.oauth?.user.username}, my Ethereum address is ${walletContext.address} and I own one or more Larskristo Hellheadz Collection NFTs from ${ERC721Instance.defaultContractAddress}`,
    );
  }, [walletContext.address, discordContext.oauth?.user.id, discordContext.oauth?.user.username]);

  useEffect(() => {
    if (signMessageError) {
      console.error(signMessageError);
    }

    if (!signMessageData || ownershipVerification.isSignatureVerified || ownershipVerification.isVerifyingSignature)
      return;

    (async () => {
      setOwnershipVerification((prev) => ({ ...prev, isVerifyingSignature: true }));

      try {
        const response = await axios.post(routes.api.discord.verifyOwnership(), {
          data: {
            discordId: discordContext.oauth?.user.id,
            discordUsername: discordContext.oauth?.user.username,
            address: walletContext.address,
            signature: signMessageData,
            chainId: walletContext.chainId,
            message,
          },
        });

        setOwnershipVerification((prev) => ({
          ...prev,
          isSignatureVerified: response.data.isVerified,
          isOwner: response.data.isOwner,
          isSignatureSent: true,
        }));
      } catch (error) {
        console.error(error);
      }

      setOwnershipVerification((prev) => ({ ...prev, isVerifyingSignature: false }));
    })();
  }, [signMessageData]);

  const handleOnSignMessage = async () => {
    if (walletContext.isConnected) {
      signMessage({
        message,
      });
    }
  };

  const handleOnDisplayWidgetClick = () => {
    if (walletContext.isConnected) {
      web3Modal.open({ view: "Account" });
    } else {
      web3Modal.open();
    }
  };

  const getLoginActions = () => {
    const commonBlocks = (
      <>
        <Card className={clsx(spacing["spacing__margin--bottom-default"])}>
          <Card.Content>
            <Typography.TextLead flat className={clsx(text["text__align--center"])}>
              You are connected to Discord as{" "}
              <strong className={clsx(text["text__color--typography-text"])}>
                {discordContext.oauth?.user.username}
              </strong>
            </Typography.TextLead>
          </Card.Content>
        </Card>
        <Card className={clsx(spacing["spacing__margin--bottom-default"])}>
          <Card.Content>
            <Typography.TextLead flat className={clsx(text["text__align--center"])}>
              You are connected to Ethereum with{" "}
              <strong className={clsx(text["text__color--typography-text"])}>
                {evm.format.truncate(walletContext.address!)}
              </strong>
            </Typography.TextLead>
          </Card.Content>
        </Card>
      </>
    );

    if (ownershipVerification.isSignatureSent && !ownershipVerification.isOwner) {
      return (
        <>
          {commonBlocks}

          <Card className={clsx(spacing["spacing__margin--bottom-default"])}>
            <Card.Content>
              <Typography.TextLead flat className={clsx(text["text__align--center"])}>
                You do not own any Larskristo Hellheadz Collection NFTs
              </Typography.TextLead>
            </Card.Content>
            <Card.Actions>
              <Button as="link" href="#" target="_blank" variant="outlined" rightIcon={<Icon name="icon-launch" />}>
                Buy now in OpenSea
              </Button>
              <Button as="link" href="#" target="_blank" variant="outlined" rightIcon={<Icon name="icon-launch" />}>
                Buy now in MagicEden
              </Button>
            </Card.Actions>
          </Card>
        </>
      );
    }

    if (ownershipVerification.isSignatureVerified && ownershipVerification.isOwner) {
      return (
        <>
          {commonBlocks}

          <Card className={clsx(spacing["spacing__margin--bottom-default"])}>
            <Card.Content>
              <Typography.TextLead flat className={clsx(text["text__align--center"])}>
                You are now verified.
                <br />
                Welcome to{" "}
                <Typography.Anchor
                  href="https://discord.com/channels/1239987861818839143/1239988024142725201"
                  target="_blank"
                >
                  Discord's LKHH private channel
                </Typography.Anchor>
                .<br />
                Enjoy the conversation!
              </Typography.TextLead>
            </Card.Content>
          </Card>
        </>
      );
    }

    if (discordContext.isLoggedIn && walletContext.isConnected) {
      return (
        <>
          {commonBlocks}

          <Button
            onClick={handleOnSignMessage}
            disabled={ownershipVerification.isVerifyingSignature}
            isLoading={ownershipVerification.isVerifyingSignature}
          >
            Good. Now verify your ownership
          </Button>
        </>
      );
    }

    if (discordContext.isLoggedIn && !walletContext.isConnected) {
      return (
        <>
          <Card className={clsx(spacing["spacing__margin--bottom-default"])}>
            <Card.Content>
              <Typography.TextLead flat className={clsx(text["text__align--center"])}>
                You are connected to Discord as <em>{discordContext.oauth?.user.username}</em>
              </Typography.TextLead>
            </Card.Content>
          </Card>

          <Button onClick={handleOnDisplayWidgetClick}>Now connect your Ethereum wallet</Button>
        </>
      );
    }

    return (
      <Button as="link" href={routes.api.oauth.discord.authorize()}>
        Log In With Discord
      </Button>
    );
  };

  return (
    <div className={clsx(styles["discord-auth-with-wallet"], className)}>
      <Grid.Container>
        <Grid.Row>
          <Grid.Col lg={6} sm={12} xs={12}>
            <section className={styles["discord-auth-with-wallet__hero"]}>
              <Typography.Headline1>
                Get access to{" "}
                <span className={clsx(text["text__color--primary"])}>Larskristo Hellheadz Collection</span>{" "}
                <span className={clsx(text["text__color--info"])}>Discord's </span>
                private channels
              </Typography.Headline1>
              <Typography.TextLead>
                Verify your asset's ownership and access the Súper Únderground stuff.
              </Typography.TextLead>
              {getLoginActions()}
            </section>
          </Grid.Col>
          <Grid.Col lg={6} sm={12} xs={12}>
            <div />
          </Grid.Col>
        </Grid.Row>
      </Grid.Container>
    </div>
  );
};
