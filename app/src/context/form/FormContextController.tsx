import React, { useEffect, useState } from "react";
import { setTimeout } from "timers";
import { sample } from "lodash";
import { APIChatHeaderKeyNames, CurrentMessageMetadata, FileAgentRequest, FileAgentResponse } from "api/chat/types";
import { OAuthTokenStoreKey } from "api/oauth/oauth.types";
import axios from "axios";
import { useRouter } from "next/router";

import { useMessageContext } from "context/message/useMessageContext";
import { ChatFormValues, FormFieldNames } from "app/chat/dropbox-chat/DropboxChat.types";
import { ChatContextMessage, TextChatCompletionMessage } from "context/message/MessageContext.types";
import { useRoutes } from "hooks/useRoutes/useRoutes";
import { useAuthorizationContext } from "context/authorization/useAuthorizationContext";
import { X_PUBLIC_BUCKET_NAME } from "providers/chat/constants";
import { OpenAIAssistantMetadata } from "providers/chat/functions/assistant/assistant.types";
import { LatestLeaseItems } from "ui/lease721/latest-lease-items/LatestLeaseItems";
import { FunctionToolCallName } from "providers/chat/functions/functions.types";

import { FormContext } from "./FormContext";
import { FormContextControllerProps, FormContextType, FormState } from "./FormContext.types";

const defaultHeight = "63px";

const processingMessages = [
  "Processing...",
  "Please wait...",
  "Still on it...",
  "Hold on...",
  "Almost there...",
  "Please be patient...",
];

const updateTextareaHeight = (id: string = "#message") => {
  const textarea = document.querySelector(id)! as HTMLTextAreaElement;

  textarea.style.height = defaultHeight;
  textarea.style.height = `${textarea.scrollHeight}px`;

  return { textarea, defaultHeight };
};

const resetTextareaHeight = (id: string = "#message") => {
  setTimeout(() => {
    const textarea = document.querySelector(id)! as HTMLTextAreaElement;

    textarea.style.height = defaultHeight;
  }, 100);
};

export const FormContextController = ({ children }: FormContextControllerProps) => {
  const [form, setForm] = useState<FormState | undefined>(undefined);
  const [currentMessageMetadata, setCurrentMessageMetadata] = useState<CurrentMessageMetadata>({});

  const messageContext = useMessageContext();

  const routes = useRoutes();

  const authContext = useAuthorizationContext();

  const router = useRouter();

  useEffect(() => {
    if (authContext.getOpenAISessionID()) {
      setCurrentMessageMetadata((prev) => ({ ...prev, openai: { threadId: authContext.getOpenAISessionID() } }));
    }
  }, [messageContext.messages]);

  const setFieldValue = (field: string, text: string) => {
    form?.mutators.setValue(field, text);

    setTimeout(() => {
      updateTextareaHeight();

      form?.focus(field);
    }, 100);
  };

  const processResult = (result: FileAgentResponse) => {
    console.log(result);

    const message = result.choices[0].message as TextChatCompletionMessage;

    if ((message.metadata as OpenAIAssistantMetadata)?.openai?.functionCallData) {
      (message.metadata as OpenAIAssistantMetadata)?.openai?.functionCallData?.forEach((data) => {
        if (data.functionCallName === FunctionToolCallName.get_latest_listings) {
          message.afterContentComponent = <LatestLeaseItems items={data.data} />;
          message.hasInnerHtml = false;
        }
      });
    }

    messageContext.appendMessage(message);

    const openAIThreadID = (result.choices[0].message.metadata as OpenAIAssistantMetadata)?.openai?.threadId;

    if (openAIThreadID) {
      authContext.setOpenAISessionID(openAIThreadID!);
    }
  };

  const submit = async (values: ChatFormValues) => {
    if (!form) return;

    messageContext.setActions((prev) => ({ ...prev, isProcessingRequest: true }));

    const message: ChatContextMessage = { content: values.message, role: "user", type: "text" };

    messageContext.appendMessage(message);

    const loadingMessage = messageContext.appendMessage({
      readOnly: true,
      type: "text",
      content: processingMessages[0],
      role: "assistant",
    });

    const processingInterval = setInterval(() => {
      const content = sample(processingMessages)!;

      messageContext.updateMessage({
        ...loadingMessage,
        content,
      });
    }, 10000);

    try {
      form.reset();

      resetTextareaHeight();

      const messages = messageContext.getPlainMessages();

      const currentMessage = messageContext.extractApiRequestValues(message);

      const headers: Record<any, string> = {};

      if (authContext.accessTokens[OAuthTokenStoreKey.dropbox_esign]) {
        headers[APIChatHeaderKeyNames.x_dropbox_access_token] =
          authContext.accessTokens[OAuthTokenStoreKey.dropbox_esign]!;
      }

      if (authContext.accessTokens[OAuthTokenStoreKey.square_api]) {
        headers[APIChatHeaderKeyNames.x_square_access_token] = authContext.accessTokens[OAuthTokenStoreKey.square_api]!;
      }

      const fileName = router.query?.fileName;

      if (fileName) {
        headers[APIChatHeaderKeyNames.x_public_bucket_name] = X_PUBLIC_BUCKET_NAME;
      }

      const options = {
        method: "POST",
        body: JSON.stringify({
          messages,
          currentMessage,
          currentMessageMetadata,
        } as FileAgentRequest),
        headers,
        timeout: 600000,
      };

      const result = await (process.env.NEXT_PUBLIC_CHAT_AI_API === "openai"
        ? axios.post<FileAgentResponse>(routes.api.chat.openai.assistantsAPI(), options)
        : axios.post<FileAgentResponse>(routes.api.chat.googleai.completionsAPI(), options));

      messageContext.deleteMessage(loadingMessage.id!);

      processResult(result.data);
    } catch (error) {
      console.error(error);

      messageContext.deleteMessage(loadingMessage.id!);

      messageContext.appendMessage({
        content: `Apologies, I wasn't able to complete your request.

        - The content may be unreadable
        - Check your internet connection`,
        role: "assistant",
        readOnly: true,
        type: "text",
      });

      form.mutators.setValue(FormFieldNames.message, values.message);
    }

    messageContext.setActions((prev) => ({ ...prev, isProcessingRequest: false }));

    clearInterval(processingInterval);
  };

  const props: FormContextType = {
    setForm,
    setFieldValue,
    setCurrentMessageMetadata,
    updateTextareaHeight,
    resetTextareaHeight,
    submit,
    form,
  };

  return <FormContext.Provider value={props}>{children}</FormContext.Provider>;
};
