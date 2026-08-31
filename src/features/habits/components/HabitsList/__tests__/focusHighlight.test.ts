import { shouldHoldFocusHighlight } from '../focusHighlight';

describe('shouldHoldFocusHighlight', () => {
  it.each([
    [false, null, false, false],
    [true, 'habit-a', false, false],
    [true, 'habit-a', false, true],
    [true, 'habit-a', true, false],
    [false, 'habit-a', true, true],
  ] as const)(
    'returns %s for pending=%s autoClose=%s ready=%s',
    (expected, pendingFocusHabitId, autoClose, focusReady) => {
      expect(
        shouldHoldFocusHighlight({
          autoClose,
          focusReady,
          pendingFocusHabitId,
        })
      ).toBe(expected);
    }
  );
});
