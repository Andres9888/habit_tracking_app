import { checkInCaption } from '../checkInCaption';
import type { MilestoneProgress } from '../../ThisWeekCard';

const progress: MilestoneProgress = {
  fillPct: 43,
  isFirst: true,
  remaining: 4,
  target: 7,
};

describe('checkInCaption', () => {
  it('shows 2-min version for minimal completions', () => {
    expect(checkInCaption({ isMinimal: true, progress })).toBe('2-min version');
  });

  it('falls back to milestone caption for full completions', () => {
    expect(checkInCaption({ isMinimal: false, progress })).toBe(
      '4 days to your first milestone — day 7'
    );
  });

  it('returns undefined when there is no milestone and not minimal', () => {
    expect(
      checkInCaption({ isMinimal: false, progress: null })
    ).toBeUndefined();
  });
});
