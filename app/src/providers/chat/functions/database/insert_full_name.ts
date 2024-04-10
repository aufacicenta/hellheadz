import { FileAgentRequest } from "api/chat/types";
import { NextApiRequest } from "next";

import { get_full_name_args } from "providers/chat/chat.types";
import logger from "providers/logger";
import sequelize from "providers/sequelize";
import { FunctionCallToolActionOutput, FunctionToolCallName } from "../functions.types";

const insert_full_name = async (
  args: get_full_name_args,
  agentRequest: FileAgentRequest,
  _request: NextApiRequest,
  functionCallName: FunctionToolCallName,
): Promise<FunctionCallToolActionOutput> => {
  try {
    const { name, lastname } = args;

    const { UserInfo } = await sequelize.load();

    const userInfo = UserInfo.build();

    userInfo.name = name || "";
    userInfo.lastname = lastname || "";
    userInfo.openai_thread_id = agentRequest.currentMessageMetadata?.openai?.threadId || "";

    await userInfo.save();

    return {
      success: true,
      functionCallName,
    };
  } catch (error) {
    logger.error(error);

    return {
      success: false,
      functionCallName,
    };
  }
};

export default insert_full_name;
