import { createContext, useContext, useState, useCallback } from "react";

/**
 * @typedef {object} I18nContextValue
 * @property {(key: string) => string} t - Translation function.
 * @property {string} locale - Current locale ("en" | "ar").
 * @property {string} dir - Text direction ("ltr" | "rtl").
 */

const I18nContext = createContext({
  /** @type {(key: string) => string} */
  t: (key) => key,
  locale: "en",
  dir: "ltr",
});

/**
 * @param {object} props
 * @param {import("react").ReactNode} props.children
 */
export function I18nProvider({ children }) {
  const [locale] = useState("en");
  const dir = "ltr";

  const t = useCallback(
    /**
     * @param {string} key
     * @returns {string}
     */
    (key) => {
      // Placeholder — returns the key itself until translations are added
      return key;
    },
    [locale],
  );

  return (
    <I18nContext.Provider value={{ t, locale, dir }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}