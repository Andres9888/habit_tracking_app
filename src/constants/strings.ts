/**
 * String Constants
 *
 * Centralized text strings for the app UI.
 * Helps maintain consistency and enables future i18n support.
 */

export const STRINGS = {
  CREATE_HABIT: {
    colorLabel: 'Color',
    createAction: 'Create habit',
    customColor: 'Custom color',
    iconLabel: 'Icon',
    nameHelper: 'Tip: Be specific — time, trigger, place.',
    nameLabel: 'Habit name',
    namePlaceholder: 'e.g., Read 10 minutes',
    close: 'Close',
    remindersHelper: "We'll only remind you at your chosen time.",
    motivationHighlight: 'Start your streak today',
    title: 'Create Habit',
    motivationSuffix: ' — consistency is key \u{1F525}',
    remindersLabel: 'Daily reminder',
    // V9 additions
    orCreateYourOwn: 'or create your own',

    reminderTime: 'Reminder time',

    reminderAnnouncementDisabled: 'Reminders disabled',

    sound: 'Sound',

    reminderAnnouncementWithTime: (label: string, time: string) =>
      `Selected ${label} reminder at ${time}`,

    templateCTA: 'Browse curated habits',

    save: 'Save',

    templateHeroSubtitle: 'Browse curated routines and auto‑fill details.',
    templateHeroTitle: 'Start from Template',
    templatePrompt: 'Prefer a ready-made routine?',
  },
} as const;

export default STRINGS;
