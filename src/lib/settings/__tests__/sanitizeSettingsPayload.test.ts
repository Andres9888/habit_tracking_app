import { sanitizeSettingsPayload } from '../sanitizeSettingsPayload';

describe('sanitizeSettingsPayload — connectorStyle', () => {
  it('passes through a valid connectorStyle value', () => {
    const result = sanitizeSettingsPayload({ connectorStyle: 'small' });
    expect(result.connectorStyle).toBe('small');
  });

  it.each(['none', 'small', 'full'])('accepts %s', (value) => {
    expect(
      sanitizeSettingsPayload({ connectorStyle: value }).connectorStyle
    ).toBe(value);
  });

  it('drops an invalid connectorStyle value', () => {
    const result = sanitizeSettingsPayload({ connectorStyle: 'ribbon' });
    expect(result.connectorStyle).toBeUndefined();
  });

  it('no longer forwards showStreakConnections', () => {
    const result = sanitizeSettingsPayload({ showStreakConnections: true });
    expect(result.showStreakConnections).toBeUndefined();
  });
});
