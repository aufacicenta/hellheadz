import { FileAgentRequest } from "api/chat/types";
import { NextApiRequest } from "next";

import { FunctionCallToolActionOutput } from "providers/chat/chat.types";
import logger from "providers/logger";

import { get_latest_listing_args } from "./types";

const get_latest_listings = async (
  _args: get_latest_listing_args,
  _agentRequest: FileAgentRequest,
  _request: NextApiRequest,
): Promise<FunctionCallToolActionOutput> => {
  try {
    return {
      success: true,
    };
  } catch (error) {
    logger.error(error);

    return {
      success: false,
    };
  }
};

export default get_latest_listings;
