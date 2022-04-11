import clsx from "clsx";
import { useEffect, useState } from "react";

import { Icon } from "ui/icon/Icon";
import { useLocalStorage } from "hooks/useLocalStorage/useLocalStorage";

import styles from "./ThemeSelector.module.scss";
import { ThemeSelectorProps, Theme } from "./ThemeSelector.types";

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className }) => {
  const localStorage = useLocalStorage();
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const localTheme = localStorage.get<Theme>("theme");

    if (!localTheme) {
      localStorage.set("theme", theme);
      document.body.dataset.theme = theme;

      return;
    }

    document.body.dataset.theme = localTheme;
    setTheme(localTheme);
  }, [localStorage, theme]);

  const handleOnThemeChange = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    localStorage.set("theme", newTheme);
    setTheme(newTheme);
  };

  return (
    <div className={clsx(className, styles["theme-selector"])}>
      <div className={styles["theme-selector__wrapper"]}>
        <div
          className={clsx(styles["theme-selector__switch"], {
            [styles["theme-selector__switch--active"]]: theme === "dark",
          })}
          onClick={handleOnThemeChange}
          onKeyDown={handleOnThemeChange}
          role="button"
          tabIndex={0}
        >
          <Icon name="icon-moon" />
        </div>
        <div className={styles["theme-selector__divider"]} />
        <div
          className={clsx(styles["theme-selector__switch"], {
            [styles["theme-selector__switch--active"]]: theme === "light",
          })}
          onClick={handleOnThemeChange}
          onKeyDown={handleOnThemeChange}
          role="button"
          tabIndex={0}
        >
          <Icon name="icon-sun" />
        </div>
      </div>
    </div>
  );
};
