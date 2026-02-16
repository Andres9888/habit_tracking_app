/**
 * Locale-aware date/time formatting utilities
 * Uses date-fns with locale support for internationalization
 * 
 * This provides a foundation for displaying dates, times, and numbers
 * in formats appropriate for the user's selected language.
 */
import { format, formatDistanceToNow } from 'date-fns';
import { enUS, ja, es } from 'date-fns/locale';
import type { Locale } from 'date-fns';
import type { SupportedLanguage } from '../i18n';

// Map of supported languages to date-fns locales
const LOCALE_MAP: Record<SupportedLanguage, Locale> = {
  en: enUS,
  ja: ja,
  es: es,
};

/**
 * Get the date-fns locale for the current language
 */
export function getDateLocale(language: SupportedLanguage): Locale {
  return LOCALE_MAP[language] || enUS;
}

/**
 * Format a date according to the user's locale
 * 
 * @param date - Date to format
 * @param formatString - Format pattern (using date-fns format tokens)
 * @param language - Current language
 * @returns Formatted date string
 * 
 * @example
 * formatDate(new Date(), 'EEEE, MMMM d', 'en') // "Monday, January 1"
 * formatDate(new Date(), 'EEEE, MMMM d', 'ja') // "月曜日, 1月 1"
 */
export function formatDate(
  date: Date,
  formatString: string,
  language: SupportedLanguage
): string {
  return format(date, formatString, {
    locale: getDateLocale(language),
  });
}

/**
 * Format a relative time (e.g., "2 hours ago")
 * 
 * @param date - Date to format
 * @param language - Current language
 * @returns Formatted relative time string
 */
export function formatRelativeTime(
  date: Date,
  language: SupportedLanguage
): string {
  return formatDistanceToNow(date, {
    addSuffix: true,
    locale: getDateLocale(language),
  });
}

/**
 * Format a number according to the user's locale
 * Handles decimal separators, thousands separators, etc.
 * 
 * @param value - Number to format
 * @param language - Current language
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 * 
 * @example
 * formatNumber(1234.56, 'en') // "1,234.56"
 * formatNumber(1234.56, 'es') // "1.234,56" (in Spanish locales)
 */
export function formatNumber(
  value: number,
  language: SupportedLanguage,
  options?: Intl.NumberFormatOptions
): string {
  const locale = language === 'en' ? 'en-US' : language === 'ja' ? 'ja-JP' : 'es-ES';
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * Format currency according to the user's locale
 * 
 * @param value - Amount to format
 * @param currency - Currency code (e.g., 'USD', 'JPY', 'EUR')
 * @param language - Current language
 * @returns Formatted currency string
 */
export function formatCurrency(
  value: number,
  currency: string,
  language: SupportedLanguage
): string {
  return formatNumber(value, language, {
    style: 'currency',
    currency,
  });
}

/**
 * Get localized day names
 * Useful for calendar displays
 */
export function getDayNames(language: SupportedLanguage): string[] {
  const locale = getDateLocale(language);
  const days: string[] = [];
  
  // Generate 7 days starting from Sunday
  for (let i = 0; i < 7; i++) {
    const date = new Date(2024, 0, i); // Jan 2024 starts on Monday
    days.push(format(date, 'EEE', { locale }));
  }
  
  return days;
}

/**
 * Get localized month names
 */
export function getMonthNames(language: SupportedLanguage): string[] {
  const locale = getDateLocale(language);
  const months: string[] = [];
  
  for (let i = 0; i < 12; i++) {
    const date = new Date(2024, i, 1);
    months.push(format(date, 'MMMM', { locale }));
  }
  
  return months;
}
