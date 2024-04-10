import { FileAgentRequest } from "api/chat/types";
import { NextApiRequest } from "next";
import { RequiredActionFunctionToolCall, Run } from "openai/resources/beta/threads/runs/runs";
import { Thread } from "openai/resources/beta/threads/threads";

import openai from "providers/openai";
import logger from "providers/logger";

import { get_full_name_args, FunctionCallToolActionOutput, FunctionToolCallName } from "./chat.types";
import insert_full_name from "./functions/database/insert_full_name";
import get_latest_listings from "./functions/assistant/asst_lIFI22Fp6TB0s77kClJ2L7PE/get_latest_listings";
import { get_latest_listing_args } from "./functions/assistant/asst_lIFI22Fp6TB0s77kClJ2L7PE/types";

const functions: Record<
  FunctionToolCallName,
  (
    args: Record<string, any>,
    agentRequest: FileAgentRequest,
    request: NextApiRequest,
  ) => Promise<FunctionCallToolActionOutput>
> = {
  [FunctionToolCallName.get_full_name]: (
    args: get_full_name_args,
    agentRequest: FileAgentRequest,
    request: NextApiRequest,
  ) => insert_full_name(args, agentRequest, request),
  [FunctionToolCallName.get_latest_listings]: (
    args: get_latest_listing_args,
    agentRequest: FileAgentRequest,
    request: NextApiRequest,
  ) => get_latest_listings(args, agentRequest, request),
};

const processFunctionToolCalls = (
  actions: RequiredActionFunctionToolCall[],
  agentRequest: FileAgentRequest,
  request: NextApiRequest,
  thread: Thread,
  run: Run,
) => {
  actions.forEach(async (action) => {
    try {
      const { arguments: args, name } = action.function;

      const output = await functions[name as FunctionToolCallName](
        typeof args === "object" ? args : (JSON.parse(args) as any),
        agentRequest,
        request,
      );

      await openai.client.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
        tool_outputs: [
          {
            tool_call_id: action.id,
            output: JSON.stringify(output),
          },
        ],
      });
    } catch (error) {
      logger.error(error);

      await openai.client.beta.threads.runs.submitToolOutputs(thread.id, run.id, {
        tool_outputs: [
          {
            tool_call_id: action.id,
            output: JSON.stringify({ success: false, error: (error as Error).message }),
          },
        ],
      });
    }
  });
};

export default processFunctionToolCalls;
