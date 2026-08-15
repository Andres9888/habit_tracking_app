/**
 * Phase 5 token verification
 */

import { colors, milestoneColors } from '@/theme/colors';
import { REDESIGN_COLORS } from '@/components/HabitCard/HabitCard.colors';

describe('Phase 5 token verification', () => {
  it('keeps primary.100 and HabitCard accentMuted', () => {
    expect(colors.primary[100]).toBe('#D1FAE5');
    expect(REDESIGN_COLORS.accentMuted).toBe(colors.primary[100]);
  });

  it('keeps milestone stone/amber tokens', () => {
    expect(milestoneColors.amber800).toBe('#92400e');
    expect(milestoneColors.stone100).toBe('#f5f5f4');
    expect(milestoneColors.stone600).toBe('#57534e');
    expect(milestoneColors.stone900).toBe('#1c1917');
  });

  it('matches current semantic / accent hex values', () => {
    expect(colors.primary[500]).toBe('#10B981');
    expect(colors.secondary[500]).toBe('#3B82F6');
    expect(colors.warning).toBe('#9A5504');
    expect(typeof colors.warning).toBe('string');
    expect(colors.error).toBe('#B53030');
    expect(colors.premium[500]).toBe('#8563C7');
  });
});
