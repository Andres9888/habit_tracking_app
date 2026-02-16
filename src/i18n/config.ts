/**
 * i18n Configuration
 * Foundation for internationalization support
 * 
 * Initial languages: English (default), Japanese, Spanish
 * Uses react-i18next with AsyncStorage for persistence
 */
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import en from './locales/en.json';
import ja from './locales/ja.json';
import es from './locales/es.json';

const STORAGE_KEY = '@chain_day:language';

// Language detector for React Native with AsyncStorage
const languageDetector = {
  type: 'languageDetector' as const,
  async: true,
  detect: async (callback: (lng: string) => void) => {
    try {
      const savedLanguage = await AsyncStorage.getItem(STORAGE_KEY);
      if (savedLanguage) {
        callback(savedLanguage);
      } else {
        // Default to English if no saved preference
        callback('en');
      }
    } catch (error) {
      console.warn('Error loading language preference:', error);
      callback('en');
    }
  },
  init: () => {},
  cacheUserLanguage: async (language: string) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, language);
    } catch (error) {
      console.warn('Error saving language preference:', error);
    }
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    compatibilityJSON: 'v3', // Required for i18next v21+ with React Native
    resources: {
      en: { translation: en },
      ja: { translation: ja },
      es: { translation: es },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false, // React already handles escaping
    },
    react: {
      useSuspense: false, // Disable suspense for React Native
    },
  });

export default i18n;
