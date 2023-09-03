import { ChatCompletionMessage } from "openai/resources/chat";
import { ReactNode } from "react";

import { DropzoneFileExtended } from "ui/dropzone/Dropzone.types";

export type ChatMessageBase = ChatCompletionMessage & {
  id?: string;
  beforeContentComponent?: ReactNode;
  afterContentComponent?: ReactNode;
};

export type TextChatCompletionMessage = {
  type: "text";
} & ChatMessageBase;

export type ReadOnlyChatCompletionMessage = {
  type: "readonly";
} & ChatMessageBase;

export type FileChatCompletionMessage = {
  type: "file";
  file: DropzoneFileExtended;
} & ChatMessageBase;

export type ChatContextMessage = FileChatCompletionMessage | TextChatCompletionMessage | ReadOnlyChatCompletionMessage;

export type MessageContextControllerProps = {
  children: ReactNode;
};

export type MessageContextType = {
  messages: Array<ChatContextMessage>;
  displayInitialMessage: () => void;
  appendMessage: (message: ChatContextMessage) => ChatContextMessage;
  updateMessage: (message: ChatContextMessage) => ChatContextMessage;
  deleteMessage: (id: ChatContextMessage["id"]) => void;
  getPlainMessages: () => Array<Pick<ChatContextMessage, "role" | "content">>;
  extractApiRequestValues: (message: ChatContextMessage) => Pick<ChatContextMessage, "role" | "content">;
};
