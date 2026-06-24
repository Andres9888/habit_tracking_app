/**
 * Searchable row labels per settings section — the single source of truth for
 * SECTION visibility during search (individual rows self-filter on their own
 * label via SettingsRow). Keep in sync with each section's SettingsRow labels.
 */
export type SettingsSectionKey =
  | 'appearance'
  | 'behavior'
  | 'reminders'
  | 'support';

export const SETTINGS_SEARCH_SECTIONS: Record<SettingsSectionKey, string[]> = {
  appearance: [
    'Theme',
    'Day marker shape',
    'Gradient streak fill',
    'Streak connections',
    'Completion icon',
    'Default growth icons',
    'Compact habit cards',
  ],
  // Habits now also owns the data rows (Archived / Export) that used to live in
  // a separate Data & Privacy section. Delete account moved to the Account page.
  behavior: [
    'Sort order',
    'Completion sound',
    'Sticky month header',
    'Archived habits',
    'Export habits data',
  ],
  reminders: ['Streak Reminders'],
  support: [
    'Rate Chain Day',
    'Share with Friends',
    'Send Feedback',
    "What's New",
  ],
};

/** True when not searching, or at least one row label in the section matches. */
export function sectionHasMatch(
  query: string,
  key: SettingsSectionKey
): boolean {
  if (!query) return true;
  return SETTINGS_SEARCH_SECTIONS[key].some((label) =>
    label.toLowerCase().includes(query)
  );
}

/** True when not searching, or any section has at least one matching row. */
export function anySectionMatches(query: string): boolean {
  if (!query) return true;
  return (Object.keys(SETTINGS_SEARCH_SECTIONS) as SettingsSectionKey[]).some(
    (key) => sectionHasMatch(query, key)
  );
}
