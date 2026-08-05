import { sanitizeSettingsPayload } from './sanitizeSettingsPayload';

describe('sanitizeSettingsPayload', () => {
  it('drops the server-owned hasPremium field (premium self-grant vector)', () => {
    // Regression guard: `hasPremium` is returned by api.settings.get and was
    // previously echoed back into api.settings.update, which (a) let any user
    // self-grant premium and (b) is now rejected by the server validator.
    const result = sanitizeSettingsPayload({
      hasPremium: true,
      showStreaks: false,
    });

    expect(result).not.toHaveProperty('hasPremium');
    expect(result.showStreaks).toBe(false);
  });

  it('still passes through legitimate user preference fields', () => {
    const result = sanitizeSettingsPayload({
      appIcon: 'default',
      darkMode: 'dark',
      reduceMotion: true,
    });

    expect(result).toEqual({
      appIcon: 'default',
      darkMode: 'dark',
      reduceMotion: true,
    });
  });

  it('never reintroduces hasPremium even when every field is present', () => {
    const result = sanitizeSettingsPayload({
      catTheme: true,
      hasPremium: true,
      streakReminderTime: '08:00',
    });

    expect(Object.keys(result)).not.toContain('hasPremium');
  });
});
