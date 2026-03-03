/**
 * CalendarTimeline Style Token Tests
 * Verifies getTodayHighlight returns correct dark/light mode colors.
 */

import {
  getTodayHighlight,
  TODAY_HIGHLIGHT,
} from '@/components/CalendarTimeline/CalendarTimeline.styles';

describe('CalendarTimeline getTodayHighlight', () => {
  it('returns light-mode amber highlight colors when isDark is false', () => {
    const light = getTodayHighlight(false);
    expect(light.background).toBe('#fffbeb'); // amber-50
    expect(light.border).toBe('#f59e0b'); // amber-500
    expect(light.text).toBe('#b45309'); // amber-700
  });

  it('returns dark-mode amber highlight colors when isDark is true', () => {
    const dark = getTodayHighlight(true);
    expect(dark.background).toBe('#3D2F0A');
    expect(dark.border).toBe('#B8860B');
    expect(dark.text).toBe('#E8B94D');
  });

  it('backward-compat TODAY_HIGHLIGHT matches light mode', () => {
    expect(TODAY_HIGHLIGHT).toEqual(getTodayHighlight(false));
  });
});
