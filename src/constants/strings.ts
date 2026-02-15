/**
 * String Constants
 *
 * Centralized text strings for the app UI.
 * Now powered by i18n — all values go through the translation system.
 *
 * MIGRATION NOTE: This file now delegates to src/i18n for all strings.
 * New strings should be added to src/i18n/locales/en.ts instead.
 * This file is kept for backward compatibility with existing imports.
 */

import { t } from '../i18n';

/**
 * Proxy that resolves strings through i18n at access time.
 * Keeps the same STRINGS.CREATE_HABIT.x API for existing consumers.
 */
export const STRINGS = {
  CREATE_HABIT: {
    get close() { return t('common.close'); },
    get colorLabel() { return t('habits.colorLabel'); },
    get createAction() { return t('habits.createAction'); },
    get customColor() { return t('habits.customColor'); },
    get iconLabel() { return t('habits.iconLabel'); },
    get motivationHighlight() { return t('habits.motivationHighlight'); },
    get motivationSuffix() { return t('habits.motivationSuffix'); },
    get nameHelper() { return t('habits.habitNameHelper'); },
    get nameLabel() { return t('habits.habitName'); },
    get namePlaceholder() { return t('habits.habitNamePlaceholder'); },
    get orCreateYourOwn() { return t('templates.orCreateYourOwn'); },
    get reminderAnnouncementDisabled() { return t('reminders.disabled'); },
    reminderAnnouncementWithTime: (label: string, time: string) =>
      t('reminders.withTime').replace('${label}', label).replace('${time}', time),
    get remindersHelper() { return t('reminders.helper'); },
    get remindersLabel() { return t('reminders.label'); },
    get reminderTime() { return t('reminders.time'); },
    get save() { return t('common.save'); },
    get sound() { return t('reminders.sound'); },
    get templateCTA() { return t('templates.browseTemplates'); },
    get templateHeroSubtitle() { return t('templates.heroSubtitle'); },
    get title() { return t('habits.createHabit'); },
    get templateHeroTitle() { return t('templates.heroTitle'); },
    get templatePrompt() { return t('templates.prompt'); },
  },
} as const;

export default STRINGS;
