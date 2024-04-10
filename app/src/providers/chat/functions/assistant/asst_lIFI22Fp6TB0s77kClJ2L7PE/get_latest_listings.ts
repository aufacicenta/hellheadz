import { FileAgentRequest } from "api/chat/types";
import { NextApiRequest } from "next";

import logger from "providers/logger";
import { FunctionCallToolActionOutput, FunctionToolCallName } from "../../functions.types";

import { get_latest_listing_args } from "./types";

const get_latest_listings = async (
  _args: get_latest_listing_args,
  _agentRequest: FileAgentRequest,
  _request: NextApiRequest,
  functionCallName: FunctionToolCallName,
): Promise<FunctionCallToolActionOutput> => {
  try {
    return {
      success: true,
      functionCallName,
      data: [
        {
          featuredImageUrl:
            "https://highlight-creator-assets.highlight.xyz/main/image/d704273a-6c72-46fb-be3a-0ee5facab689.jpeg?d=720x720",
          name: "Test",
          pricePerHour: "0.1",
          ownerAddress: "0x123",
          contractAddress: "0x456",
        },
        {
          featuredImageUrl:
            "https://highlight-creator-assets.highlight.xyz/main/image/02d89c82-c603-4dec-be1f-c85d2812f796.jpeg?d=720x720",
          name: "Test",
          pricePerHour: "0.1",
          ownerAddress: "0x123",
          contractAddress: "0x456",
        },
        {
          featuredImageUrl:
            "https://highlight-creator-assets.highlight.xyz/main/image/99eba21e-e3f9-4760-9590-c8be6625a3da.jpeg?d=720x720",
          name: "Test",
          pricePerHour: "0.1",
          ownerAddress: "0x123",
          contractAddress: "0x456",
        },
      ],
    };
  } catch (error) {
    logger.error(error);

    return {
      success: false,
      functionCallName,
    };
  }
};

export default get_latest_listings;
