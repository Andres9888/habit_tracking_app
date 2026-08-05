import { formatMemberSince } from '@/components/SettingsModal/memberSince';

const MARCH_2025 = new Date('2025-03-14T12:00:00Z').getTime();
const JULY_2024 = new Date('2024-07-02T12:00:00Z').getTime();

describe('formatMemberSince', () => {
  it('formats createdAt as month and year', () => {
    expect(formatMemberSince({ createdAt: MARCH_2025 })).toBe(
      'Member since March 2025'
    );
  });

  it('falls back to _creationTime when createdAt is absent', () => {
    expect(formatMemberSince({ _creationTime: JULY_2024 })).toBe(
      'Member since July 2024'
    );
  });

  it('prefers createdAt over _creationTime', () => {
    expect(
      formatMemberSince({ _creationTime: JULY_2024, createdAt: MARCH_2025 })
    ).toBe('Member since March 2025');
  });

  it('returns null when the user is missing or has no timestamp', () => {
    expect(formatMemberSince(null)).toBeNull();
    expect(formatMemberSince(undefined)).toBeNull();
    expect(formatMemberSince({})).toBeNull();
  });

  it('returns null for non-finite or non-positive timestamps', () => {
    expect(formatMemberSince({ createdAt: Number.NaN })).toBeNull();
    expect(formatMemberSince({ createdAt: Number.POSITIVE_INFINITY })).toBeNull();
    expect(formatMemberSince({ createdAt: 0 })).toBeNull();
    expect(formatMemberSince({ createdAt: -1 })).toBeNull();
  });
});
