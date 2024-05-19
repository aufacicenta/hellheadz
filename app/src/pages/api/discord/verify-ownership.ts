import { NextApiRequest, NextApiResponse } from "next";
import { verifyMessage } from "@wagmi/core";

import logger from "providers/logger";
import wagmi from "providers/wagmi";

export default async function Fn(request: NextApiRequest, response: NextApiResponse) {
  try {
    logger.info(`api.discord.verify-ownership`);

    const { data } = request.body;

    const isVerified = await verifyMessage(wagmi.defaultConfig, {
      chainId: data.chainId,
      address: data.address,
      message: JSON.stringify(data.message),
      signature: data.signature,
    });

    logger.info(`api.discord.verify-ownership: isVerified: ${isVerified}`);

    response.json({ isVerified });
  } catch (error) {
    logger.error(error);

    response.status(500).json({
      error: (error as Error).message,
    });
  }
}
