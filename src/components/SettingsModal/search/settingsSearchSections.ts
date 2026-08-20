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
  // The calendar-look knobs (shape / fill / connections / completion icon) now
  // live on the Calendar look sub-page; 'Calendar look' is their search entry.
  appearance: ['Theme', 'Calendar look', 'Compact habit cards'],
  // Completion sound lives under Reminders; Habits owns sorting + archive +
  // export (mock 3B folded the one-row Privacy & Security card in here).
  behavior: ['Sort order', 'Archived habits', 'Export my data'],
  reminders: ['Streak reminders', 'Completion sound'],
  support: ['Love Chain Day?', 'Send feedback'],
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
