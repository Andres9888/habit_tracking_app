import { buildLadder } from '../goalLadder';
import { suggestedGoal } from '../presets';

describe('buildLadder', () => {
  it('orders the marks along the track and clamps to the goal', () => {
    const marks = buildLadder(9, 12, 30);
    expect(marks.map((mark) => mark.kind)).toEqual([
      'past',
      'now',
      'record',
      'goal',
    ]);
    expect(marks.map((mark) => mark.value)).toEqual([7, 9, 12, 30]);
    expect(marks[3]?.leftPct).toBe(100);
  });

  it('never stacks two dots on the same day', () => {
    expect(buildLadder(7, 7, 30).map((mark) => mark.value)).toEqual([7, 30]);
    expect(buildLadder(12, 12, 30).map((mark) => mark.value)).toEqual([
      7, 12, 30,
    ]);
  });

  it('drops the record mark once the goal is the thing to beat', () => {
    expect(buildLadder(3, 40, 30).map((mark) => mark.kind)).toEqual([
      'now',
      'past',
      'goal',
    ]);
  });

  it('does not stack the goal dot on the now dot once the goal is reached', () => {
    expect(buildLadder(7, 7, 7).map((mark) => mark.kind)).toEqual(['now']);
    expect(buildLadder(30, 19, 30).map((mark) => mark.kind)).toEqual([
      'past',
      'record',
      'now',
    ]);
  });

  it('has nothing to draw without a goal', () => {
    expect(buildLadder(5, 9, 0)).toEqual([]);
  });

  it('labels the now mark "today" when no run is open', () => {
    const marks = buildLadder(0, 12, 30);
    const now = marks.find((mark) => mark.kind === 'now');
    expect(now).toEqual({ kind: 'now', label: 'today', leftPct: 0, value: 0 });
  });
});

describe('suggestedGoal', () => {
  it('picks the shortest preset that clears the record', () => {
    expect(suggestedGoal(0)).toBe(7);
    expect(suggestedGoal(9)).toBe(21);
    expect(suggestedGoal(25)).toBe(30);
  });

  it('falls back to the longest preset once the record passes them all', () => {
    expect(suggestedGoal(120)).toBe(30);
  });
});
