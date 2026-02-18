/**
 * String Constants
 *
 * Centralized text strings for the app UI.
 * Helps maintain consistency and enables future i18n support.
 */

export const STRINGS = {
  CREATE_HABIT: {
    close: 'Close',
    colorLabel: 'Color',
    createAction: 'Create Habit',
    customColor: 'Custom color',
    iconLabel: 'Icon',
    motivationHighlight: 'Start your streak today',
    motivationSuffix: ' — consistency is key 🔥',
    nameHelper: 'Tip: Be specific — include a time, trigger, or place.',
    nameLabel: 'Habit name',
    namePlaceholder: 'e.g., Read for 10 minutes before bed',
    // V9 additions
    orCreateYourOwn: 'or create your own',
    
reminderAnnouncementDisabled: 'Reminders disabled',
    
reminderAnnouncementWithTime: (label: string, time: string) =>
      `Selected ${label} reminder at ${time}`,
    
    remindersHelper: "We'll only remind you at your chosen time.",

    remindersLabel: 'Daily reminder',

    reminderTime: 'Reminder time',

    save: 'Save',

    sound: 'Sound',

    templateCTA: 'Browse curated habits',

    templateHeroSubtitle: 'Browse curated routines and auto-fill the details.',

    title: 'Create Habit',
    templateHeroTitle: 'Start from Template',
    templatePrompt: 'Want a ready-made routine?',
  },
} as const;

export default STRINGS;
