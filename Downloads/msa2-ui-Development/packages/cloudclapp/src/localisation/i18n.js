import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";
import backend from "i18next-xhr-backend";
import en from "./locales/en";
import fr from "./locales/fr";
import jp from "./locales/jp";

const options = {
  addPath: "./components/localisation/locales/add/dev/translation",
};

i18n
  .use(detector)
  .use(backend)
  .use(initReactI18next)
  .init({
    backend: options,
    resources: { en, fr, jp },
    fallbackLng: "en",
    defaultNS: "default",
    fallbackNS: "default",
    saveMissing: false,
    sendMissingTo: "all",
    sendMissing: false,
    debug: false,
    keySeparator: false,
    interpolation: {
      escapeValue: false,
    },
    react: {
      bindI18n: "languageChanged",
      bindI18nStore: "",
      transEmptyNodeValue: "",
      transSupportBasicHtmlNodes: true,
      transKeepBasicHtmlNodesFor: ["br", "strong", "i"],
      useSuspense: false,
    },
  });

export default i18n;
