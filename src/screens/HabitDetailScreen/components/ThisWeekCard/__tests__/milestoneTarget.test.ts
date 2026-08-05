import { milestoneCaption, milestoneTarget } from '../milestoneTarget';

describe('milestoneTarget', () => {
  it('aims at the personal best while it is still ahead', () => {
    expect(milestoneTarget(9, 12)).toEqual({ isBest: true, target: 12 });
  });

  it('re-aims at the next round milestone once the best is matched', () => {
    expect(milestoneTarget(12, 12)).toEqual({ isBest: false, target: 14 });
  });

  it('never sits full past the last named milestone', () => {
    const { target } = milestoneTarget(400, 400);
    expect(target).toBe(730);
  });
});

describe('milestoneCaption', () => {
  it('counts down to the personal best', () => {
    expect(milestoneCaption(9, 12, true)).toBe(
      '3 days from your best streak ever'
    );
  });

  it('singularises the final day', () => {
    expect(milestoneCaption(11, 12, true)).toBe(
      '1 day from your best streak ever'
    );
  });

  it('frames a zero streak as a fresh start', () => {
    expect(milestoneCaption(0, 12, true)).toBe(
      'Your best run is 12 days — today starts the next one'
    );
  });
});
