import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';
import en from '../locales/en.json';
import it from '../locales/it.json';

export const LANGUAGES = ['en', 'it'] as const;
export type Language = (typeof LANGUAGES)[number];

export const LANGUAGE_STORAGE_KEY = 'walter-lang';

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      it: { translation: it },
    },
    supportedLngs: LANGUAGES,
    fallbackLng: 'en',
    // A visitor on it-IT should get Italian, not fall through to English.
    load: 'languageOnly',
    nonExplicitSupportedLngs: true,
    detection: {
      // Their stored choice wins; otherwise follow the browser. No cookie —
      // the notice's "no cookies" claim is load-bearing, so this is
      // localStorage only.
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
    },
    interpolation: {
      // React escapes for us.
      escapeValue: false,
    },
    returnObjects: true,
  });

/** Keeps <html lang> in step so screen readers and browsers get it right. */
i18n.on('languageChanged', (lng) => {
  document.documentElement.lang = lng;
});
document.documentElement.lang = i18n.resolvedLanguage ?? 'en';

export default i18n;
