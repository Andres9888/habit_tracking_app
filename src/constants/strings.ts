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
    nameTitle: 'New habit',
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

    templateCTA: 'Browse the Habit library',

    templateHeroSubtitle: 'Pick a proven habit — the details fill themselves.',

    title: 'Create Habit',
    templatePrompt: 'Want a head start?',
  },
} as const;

export default STRINGS;
