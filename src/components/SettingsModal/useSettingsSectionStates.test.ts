import { migrateSectionPrefs } from './useSettingsSectionStates';

describe('migrateSectionPrefs', () => {
  it('defaults all sections to expanded with no stored prefs', () => {
    expect(migrateSectionPrefs({})).toEqual({
      appearance: true,
      behavior: true,
      notifications: true,
    });
  });

  it('honors stored state for current section keys', () => {
    expect(
      migrateSectionPrefs({
        appearance: { isExpanded: false },
        notifications: { isExpanded: false },
      })
    ).toEqual({ appearance: false, behavior: true, notifications: false });
  });

  it('folds legacy habitManagement state into behavior', () => {
    expect(
      migrateSectionPrefs({ habitManagement: { isExpanded: false } }).behavior
    ).toBe(false);
  });

  it('prefers an explicit behavior key over legacy habitManagement', () => {
    expect(
      migrateSectionPrefs({
        behavior: { isExpanded: true },
        habitManagement: { isExpanded: false },
      }).behavior
    ).toBe(true);
  });

  it('drops retired section keys (support, about, account)', () => {
    expect(
      migrateSectionPrefs({
        about: { isExpanded: false },
        account: { isExpanded: false },
        support: { isExpanded: false },
      })
    ).toEqual({ appearance: true, behavior: true, notifications: true });
  });
});
