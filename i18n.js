import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import * as en from "./locales/en/translation.json";
import * as uk from "./locales/uk/translation.json";
import * as Localization from "expo-localization";

const SUPPORTED_LANGUAGES = ["en", "uk"];

const locales = Localization.getLocales();
let deviceLanguage = locales.length ? locales[0].languageCode : "en";

console.log("locales", locales);

if (!SUPPORTED_LANGUAGES.includes(deviceLanguage)) {
  deviceLanguage = "en";
}

i18n
  .use(initReactI18next)
  .init({
    compatibilityJSON: "v3",
    lng: deviceLanguage,
    fallbackLng: "en",
    resources: {
      en: { translation: en },
      uk: { translation: uk },
    },
    interpolation: {
      escapeValue: false,
    },
  })
  .then(() => {
    // Init complete!
  });

export default i18n;
