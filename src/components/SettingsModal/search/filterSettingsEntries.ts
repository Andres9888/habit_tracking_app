import {
  SETTINGS_SEARCH_ENTRIES,
  type SettingsEntry,
} from './settingsSearchRegistry';

export function filterSettingsEntries(
  query: string,
  entries: SettingsEntry[] = SETTINGS_SEARCH_ENTRIES
): SettingsEntry[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return entries.filter(
    (e) =>
      e.label.toLowerCase().includes(q) ||
      e.keywords.some((k) => k.toLowerCase().includes(q))
  );
}
