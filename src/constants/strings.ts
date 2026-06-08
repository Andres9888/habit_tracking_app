/**
 * String Constants
 *
 * Centralized text strings for the app UI.
 * Helps maintain consistency and enables future i18n support.
 */

import { DEFAULT_HABIT_NAME_PLACEHOLDER } from './habitNamePlaceholders';

export const STRINGS = {
  CREATE_HABIT: {
    close: 'Close',
    colorLabel: 'Color',
    createAction: 'Create Habit',
    customColor: 'Custom color',
    iconLabel: 'Icon',
    motivationHighlight: 'Start your streak today',
    motivationSuffix: ' — consistency is key 🔥',
    nameLabel: 'Habit name',
    namePlaceholder: DEFAULT_HABIT_NAME_PLACEHOLDER,
    namePrompt: 'Name your habit',
    nameTitle: 'Name your new habit',
    // V9 additions
    orCreateYourOwn: 'or create your own',

    reminderAnnouncementDisabled: 'Reminders disabled',

    reminderAnnouncementWithTime: (label: string, time: string) =>
      `Selected ${label} reminder at ${time}`,

    remindersHelper: "We'll only remind you at your chosen time.",

    remindersLabel: 'Daily reminder',

    reminderTime: 'Reminder time',

    save: 'Save',

    saving: 'Saving…',

    sound: 'Sound',

    templateCTA: 'Browse curated habits',

    templateHeroSubtitle: 'Browse curated routines and auto-fill the details.',

    title: 'Create Habit',
    templateHeroTitle: 'Start from Template',
    templatePrompt: 'Want a ready-made routine?',
  },
} as const;

export default STRINGS;
