/**
 * GDPR: account deletion must cover every user-scoped table.
 *
 * habitDayNotes landed after the April 2026 erasure pass. This scan fails if
 * deleteCurrentUserData stops querying a user-owned table.
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const source = readFileSync(join(__dirname, 'users.ts'), 'utf8');

const USER_SCOPED_TABLES = [
  'deletedHabits',
  'habitDayNotes',
  'habits',
  'rateLimits',
  'storageOwnership',
  'subscriptions',
  'templateUsage',
  'tracking',
  'userSettings',
  'users',
] as const;

describe('SEC: deleteCurrentUserData covers user-scoped tables', () => {
  it('queries each user-scoped table', () => {
    for (const table of USER_SCOPED_TABLES) {
      expect(source).toContain(`query('${table}')`);
    }
  });

  it('returns a deletedDayNotes count', () => {
    expect(source).toContain('deletedDayNotes');
  });
});
