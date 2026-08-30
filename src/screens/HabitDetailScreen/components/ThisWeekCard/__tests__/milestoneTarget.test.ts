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

  it('uses singular grammar for a one-day personal best', () => {
    expect(milestoneCaption(0, 1, true)).toBe(
      'Your best run is 1 day — today starts the next one'
    );
  });

  it('appends the remaining goal sentence when a goal is still ahead', () => {
    expect(milestoneCaption(9, 12, true, 14)).toBe(
      '3 days from your best streak ever. 5 days from your 14-day goal.'
    );
  });

  it('singularises the goal countdown when one day remains', () => {
    expect(milestoneCaption(11, 12, true, 12)).toBe(
      '1 day from your best streak ever. 1 day from your 12-day goal.'
    );
  });

  it('closes the personal-best clause before the goal sentence', () => {
    expect(milestoneCaption(12, 12, true, 30)).toBe(
      'Personal best territory. 18 days from your 30-day goal.'
    );
  });

  it('omits the goal sentence once the goal has been met', () => {
    expect(milestoneCaption(12, 14, false, 12)).toBe('2 days to 14');
  });

  it('omits the goal sentence when there is no current streak yet', () => {
    expect(milestoneCaption(0, 12, true, 14)).toBe(
      'Your best run is 12 days — today starts the next one'
    );
  });

  it('omits the goal sentence when the goal is unset', () => {
    expect(milestoneCaption(9, 12, true, 0)).toBe(
      '3 days from your best streak ever'
    );
    expect(milestoneCaption(9, 12, true)).toBe(
      '3 days from your best streak ever'
    );
  });
});
