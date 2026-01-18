export const STRINGS = {
  CREATE_HABIT: {
    title: 'Create Habit',
    nameLabel: 'Habit name',
    namePlaceholder: 'e.g., Read 10 minutes',
    nameHelper: 'Tip: Be specific — time, trigger, place.',
    iconLabel: 'Icon',
    colorLabel: 'Color',
    customColor: 'Custom color',
    remindersLabel: 'Daily reminder',
    remindersHelper: "We'll only remind you at your chosen time.",
    reminderTime: 'Reminder time',
    sound: 'Sound',
    createAction: 'Create habit',
    templateHeroTitle: 'Start from Template',
    templateHeroSubtitle: 'Browse curated routines and auto‑fill details.',
    templatePrompt: 'Prefer a ready-made routine?',
    templateCTA: 'Browse curated habits',
    save: 'Save',
    close: 'Close',
    // V9 additions
    orCreateYourOwn: 'or create your own',
    motivationHighlight: 'Start your streak today',
    motivationSuffix: ' — consistency is key \u{1F525}',
    reminderAnnouncementWithTime: (label: string, time: string) =>
      `Selected ${label} reminder at ${time}`,
    reminderAnnouncementDisabled: 'Reminders disabled',
  },
} as const;

export default STRINGS;
