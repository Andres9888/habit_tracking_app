/**
 * StatsNotesModal was removed — keep token assertions current
 */

import { colors } from '@/theme/colors';

describe('Theme tokens used by former StatsNotesModal charts', () => {
  it('matches current warm-paper palette', () => {
    expect(colors.primary[400]).toBe('#34D399');
    expect(colors.gray[200]).toBe('#DDD8D2');
    expect(colors.gray[300]).toBe('#C4BFB7');
    expect(colors.gray[400]).toBe('#6E6660');
    expect(colors.gray[500]).toBe('#6B6560');
    expect(colors.border).toBe('#DDD8D2');
  });
});
