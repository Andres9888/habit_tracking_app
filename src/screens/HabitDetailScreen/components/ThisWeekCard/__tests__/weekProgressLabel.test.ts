/**
 * "0 days logged" is a grade handed out before the reader has had a chance to
 * do anything. While nothing is logged and the week still has scheduled days
 * in it, the label looks forward instead — and switches back the moment the
 * count means something.
 */
import { weekProgressLabel } from '../weekProgressLabel';

describe('weekProgressLabel', () => {
  it('counts the chances left before anything is logged', () => {
    expect(weekProgressLabel(0, 5)).toEqual({
      label: '5 days left',
      tone: 'accent',
    });
  });

  it('says "1 day left" rather than "1 days left"', () => {
    expect(weekProgressLabel(0, 1)).toEqual({
      label: '1 day left',
      tone: 'accent',
    });
  });

  it('reports the empty count once the week has no chances left', () => {
    expect(weekProgressLabel(0, 0)).toEqual({
      label: '0 days logged',
      tone: 'muted',
    });
  });

  it('goes back to the logged count as soon as one day is banked', () => {
    expect(weekProgressLabel(2, 3)).toEqual({
      label: '2 days logged',
      tone: 'muted',
    });
    expect(weekProgressLabel(1, 0)).toEqual({
      label: '1 day logged',
      tone: 'muted',
    });
  });
});
