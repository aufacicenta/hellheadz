import { FunctionCallToolActionOutput } from "../functions.types";

export type OpenAIAssistantMetadata = {
  openai?: {
    threadId?: string;
    functionCallData?: FunctionCallToolActionOutput[];
  };
};
