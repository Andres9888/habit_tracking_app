import { insightQueryStart } from '../insightQueryStart';

jest.mock('../../../../utils/getLocalDateString', () => ({
  getLocalDateString: (date?: Date) => {
    if (!date) return '2026-01-15';
    return date.toISOString().slice(0, 10);
  },
}));

describe('insightQueryStart', () => {
  const today = '2026-01-15';

  it('falls back to calendar year start when createdAt is missing', () => {
    expect(insightQueryStart(today)).toBe('2026-01-01');
  });

  it('starts at habit creation when that is before this year', () => {
    expect(insightQueryStart(today, Date.parse('2025-12-20T12:00:00Z'))).toBe(
      '2025-12-20'
    );
  });

  it('does not start in the future', () => {
    expect(insightQueryStart(today, Date.parse('2026-02-01T12:00:00Z'))).toBe(
      '2026-01-01'
    );
  });
});
