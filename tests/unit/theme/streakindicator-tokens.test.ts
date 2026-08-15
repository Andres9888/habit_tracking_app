/**
 * Milestone token tests for streak UI.
 * StreakIndicator was removed; tokens still live on the theme.
 */

import { milestoneColors } from '@/theme/colors';

describe('Streak milestone tokens', () => {
  it('7-day amber token is defined', () => {
    expect(milestoneColors.amber).toBe('#F59E0B');
  });

  it('30-day yellow token is defined', () => {
    expect(milestoneColors.yellow).toBe('#EAB308');
  });

  it('100-day violet token is defined', () => {
    expect(milestoneColors.violet).toBe('#8B5CF6');
  });

  it('badge surface tokens are defined', () => {
    expect(milestoneColors.amberLight).toBe('#FEF9C3');
    expect(milestoneColors.amberBorder).toBe('#FCD34D');
    expect(milestoneColors.amberText).toBe('#A16207');
  });
});
