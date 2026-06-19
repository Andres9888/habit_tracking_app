import { filterSettingsEntries } from './filterSettingsEntries';
import { SETTINGS_SEARCH_ENTRIES } from './settingsSearchRegistry';

describe('filterSettingsEntries', () => {
  it('returns [] for empty/whitespace query', () => {
    expect(filterSettingsEntries('')).toEqual([]);
    expect(filterSettingsEntries('   ')).toEqual([]);
  });
  it('matches by label, case-insensitive', () => {
    const r = filterSettingsEntries('THEME');
    expect(r.some((e) => e.id === 'theme')).toBe(true);
  });
  it('matches by keyword synonym', () => {
    const r = filterSettingsEntries('dark mode');
    expect(r.some((e) => e.id === 'theme')).toBe(true);
  });
  it('matches export via "csv" keyword', () => {
    const r = filterSettingsEntries('csv');
    expect(r.some((e) => e.id === 'export')).toBe(true);
  });
  it('every registry entry has a non-empty label and group', () => {
    for (const e of SETTINGS_SEARCH_ENTRIES) {
      expect(e.label.length).toBeGreaterThan(0);
      expect(e.group.length).toBeGreaterThan(0);
    }
  });
});
