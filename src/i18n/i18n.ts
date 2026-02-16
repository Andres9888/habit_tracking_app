/**
 * i18n Configuration
 *
 * Sets up i18next with expo-localization for automatic device locale detection.
 * Supports English (en) and Japanese (ja).
 *
 * Usage:
 *   import '@/i18n/i18n';  // Initialize once in App.tsx
 *   import { useTranslation } from 'react-i18next';
 *   const { t } = useTranslation();
 *   t('common.save') // → "Save" or "保存"
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import { getLocales } from 'expo-localization';

import en from './locales/en.json';
import ja from './locales/ja.json';

export const SUPPORTED_LANGUAGES = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

/**
 * Detect the best matching language from device locales.
 * Falls back to 'en' if no match found.
 */
function getDeviceLanguage(): LanguageCode {
  try {
    const locales = getLocales();
    if (locales.length > 0) {
      const deviceLang = locales[0].languageCode;
      if (deviceLang === 'ja') return 'ja';
    }
  } catch {
    // expo-localization may fail in some environments
  }
  return 'en';
}

const resources = {
  en: { translation: en },
  ja: { translation: ja },
} as const;

void i18n.use(initReactI18next).init({
  compatibilityJSON: 'v4',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false, // React already handles XSS
  },
  lng: getDeviceLanguage(),
  resources,
});

export { default } from 'i18next';
