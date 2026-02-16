/**
 * useI18n Hook
 * Provides translation function and language switching
 */
import { useTranslation } from 'react-i18next';

export type SupportedLanguage = 'en' | 'ja' | 'es';

export interface LanguageOption {
  code: SupportedLanguage;
  label: string;
  nativeLabel: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English', nativeLabel: 'English' },
  { code: 'ja', label: 'Japanese', nativeLabel: '日本語' },
  { code: 'es', label: 'Spanish', nativeLabel: 'Español' },
];

export function useI18n() {
  const { t, i18n } = useTranslation();

  const changeLanguage = async (language: SupportedLanguage) => {
    await i18n.changeLanguage(language);
  };

  return {
    t,
    currentLanguage: i18n.language as SupportedLanguage,
    changeLanguage,
    supportedLanguages: SUPPORTED_LANGUAGES,
  };
}
