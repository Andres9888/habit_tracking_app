/**
 * Internationalization (i18n) Foundation
 *
 * Lightweight, zero-dependency i18n system for React Native.
 *
 * Usage:
 *   import { t } from '@/i18n';
 *   t('common.cancel')        // → 'Cancel'
 *   t('auth.email')           // → 'Email'
 *
 * Locale-aware date helpers:
 *   import { i18nDayName, i18nMonthName, i18nMeridiem } from '@/i18n';
 *   i18nDayName(0)            // → 'Sunday'
 *   i18nMonthName(0)          // → 'January'
 *   i18nMeridiem(14)          // → 'PM'
 *
 * To add a new language:
 *   1. Copy src/i18n/locales/en.ts → src/i18n/locales/<code>.ts
 *   2. Translate values (keep keys identical)
 *   3. Register in LOCALES map below
 */

import { Platform, NativeModules } from 'react-native';
import en, { type TranslationKeys } from './locales/en';
import es from './locales/es';
import ja from './locales/ja';

// ── Supported locales ──────────────────────────────────────────────
type LocaleCode = 'en' | 'es' | 'ja';

const LOCALES: Record<LocaleCode, unknown> = {
  en,
  es,
  ja,
};

const DEFAULT_LOCALE: LocaleCode = 'en';

// ── Locale detection ───────────────────────────────────────────────
function detectDeviceLocale(): LocaleCode {
  try {
    let deviceLocale: string | undefined;

    if (Platform.OS === 'ios') {
      // iOS: NativeModules.SettingsManager
      deviceLocale =
        NativeModules.SettingsManager?.settings?.AppleLocale ??
        NativeModules.SettingsManager?.settings?.AppleLanguages?.[0];
    } else if (Platform.OS === 'android') {
      // Android: NativeModules.I18nManager
      deviceLocale = NativeModules.I18nManager?.localeIdentifier;
    }

    if (!deviceLocale) return DEFAULT_LOCALE;

    // Normalize: "en_US" → "en", "es-419" → "es"
    const code = deviceLocale.split(/[-_]/)[0].toLowerCase() as LocaleCode;
    return code in LOCALES ? code : DEFAULT_LOCALE;
  } catch {
    return DEFAULT_LOCALE;
  }
}

// ── State ──────────────────────────────────────────────────────────
let currentLocale: LocaleCode = detectDeviceLocale();

/** Get the current locale code */
export function getLocale(): LocaleCode {
  return currentLocale;
}

/** Change locale at runtime */
export function setLocale(code: LocaleCode): void {
  if (code in LOCALES) {
    currentLocale = code;
  }
}

// ── Translation lookup ─────────────────────────────────────────────

/**
 * Resolve a dot-notation key against a translation object.
 * Falls back to English if key is missing in the active locale.
 */
function resolve(obj: unknown, path: string): unknown {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let current: any = obj;
  for (const segment of path.split('.')) {
    if (current == null || typeof current !== 'object') return undefined;
    current = current[segment];
  }
  return current;
}

/**
 * Translate a key using the current locale with English fallback.
 *
 * @example
 *   t('common.cancel')   // → 'Cancel'
 *   t('auth.email')      // → 'Email'  (or translated equivalent)
 */
export function t(key: string): string {
  const locale = LOCALES[currentLocale];
  const value = resolve(locale, key) ?? resolve(en, key);

  if (typeof value === 'string') return value;
  if (value === undefined) {
    if (__DEV__) {
      // eslint-disable-next-line no-console
      console.warn(`[i18n] Missing translation key: "${key}"`);
    }
    return key; // Return the key itself as last resort
  }
  return String(value);
}

// ── Locale-aware date/time helpers ─────────────────────────────────

const DAY_KEYS = [
  'sunday',
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
] as const;

const DAY_SHORT_KEYS = [
  'sun',
  'mon',
  'tue',
  'wed',
  'thu',
  'fri',
  'sat',
] as const;

const MONTH_KEYS = [
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;

const MONTH_SHORT_KEYS = [
  'jan',
  'feb',
  'mar',
  'apr',
  'may',
  'jun',
  'jul',
  'aug',
  'sep',
  'oct',
  'nov',
  'dec',
] as const;

/** Get localized full day name (0 = Sunday) */
export function i18nDayName(dayIndex: number): string {
  const key = DAY_KEYS[dayIndex % 7];
  return t(`dateTime.days.${key}`);
}

/** Get localized short day name (0 = Sun) */
export function i18nDayNameShort(dayIndex: number): string {
  const key = DAY_SHORT_KEYS[dayIndex % 7];
  return t(`dateTime.daysShort.${key}`);
}

/** Get localized full month name (0 = January) */
export function i18nMonthName(monthIndex: number): string {
  const key = MONTH_KEYS[monthIndex % 12];
  return t(`dateTime.months.${key}`);
}

/** Get localized short month name (0 = Jan) */
export function i18nMonthNameShort(monthIndex: number): string {
  const key = MONTH_SHORT_KEYS[monthIndex % 12];
  return t(`dateTime.monthsShort.${key}`);
}

/** Get localized AM/PM string */
export function i18nMeridiem(hour: number): string {
  return hour < 12 ? t('dateTime.am') : t('dateTime.pm');
}

/**
 * Format a date in locale-aware "Sunday, October 19" style.
 * Replaces date-fns format('EEEE, MMMM d') with i18n-aware version.
 */
export function i18nFormatDate(date: Date): string {
  const dayName = i18nDayName(date.getDay());
  const monthName = i18nMonthName(date.getMonth());
  const day = date.getDate();
  return `${dayName}, ${monthName} ${day}`;
}

/**
 * Format a time in locale-aware "7:03 AM" style.
 * Replaces date-fns format('h:mm a') with i18n-aware version.
 */
export function i18nFormatTime(date: Date): string {
  let hours = date.getHours();
  const minutes = date.getMinutes();
  const meridiem = i18nMeridiem(hours);
  hours = hours % 12 || 12;
  const mins = minutes.toString().padStart(2, '0');
  return `${hours}:${mins} ${meridiem}`;
}

// ── Re-exports ─────────────────────────────────────────────────────
export type { TranslationKeys, LocaleCode };
