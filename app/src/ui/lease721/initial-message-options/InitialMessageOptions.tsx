import clsx from "clsx";

import { Button } from "ui/button/Button";
import { useFormContext } from "context/form/useFormContext";
import { FormFieldNames } from "app/chat/dropbox-chat/DropboxChat.types";

import { InitialMessageOptionsProps } from "./InitialMessageOptions.types";
import styles from "./InitialMessageOptions.module.scss";

export const InitialMessageOptions: React.FC<InitialMessageOptionsProps> = ({ className }) => {
  const formContext = useFormContext();

  const onClickWhy = () => {
    const msg = `Why should I rent my NFTs? (ERC721)`;
    formContext.setFieldValue(FormFieldNames.message, msg);
    formContext.submit({ message: msg });
  };

  const onClickHow = () => {
    const msg = `How does it work?`;
    formContext.setFieldValue(FormFieldNames.message, msg);
    formContext.submit({ message: msg });
  };

  const onClickShowMe = () => {
    const msg = `Show me the latest listings`;
    formContext.setFieldValue(FormFieldNames.message, msg);
    formContext.submit({ message: msg });
  };

  const onSubmitMine = () => {
    const msg = `Submit mine for lease!`;
    formContext.setFieldValue(FormFieldNames.message, msg);
    formContext.submit({ message: msg });
  };

  return (
    <div className={clsx(styles["initial-message-options"], className)}>
      <Button variant="outlined" size="s" onClick={onClickWhy}>
        Why should I rent my NFTs?
      </Button>
      <Button variant="outlined" size="s" onClick={onClickHow}>
        How does it work?
      </Button>
      <Button variant="outlined" size="s" onClick={onClickShowMe}>
        Show me the latest listings
      </Button>
      <Button variant="outlined" size="s" onClick={onSubmitMine}>
        Submit mine for lease!
      </Button>
    </div>
  );
};
