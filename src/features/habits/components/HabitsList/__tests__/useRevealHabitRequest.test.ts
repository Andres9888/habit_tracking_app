import { act, renderHook } from '@testing-library/react-native';
import {
  REVEAL_SETTLE_MS,
  useRevealHabitRequest,
} from '../useRevealHabitRequest';

const habit = (id: string) => ({ _id: id as never, name: `Habit ${id}` });

function setup(revealHabitId: string | null, habits = [habit('a'), habit('b'), habit('c')]) {
  const listRef = {
    current: { scrollToEnd: jest.fn(), scrollToIndex: jest.fn() },
  };
  const clearRevealHabit = jest.fn();
  const setJustCreatedHabitId = jest.fn();
  const hook = renderHook(
    (p: { habits: typeof habits; revealHabitId: string | null }) =>
      useRevealHabitRequest({
        clearRevealHabit,
        habits: p.habits as never,
        listRef: listRef as never,
        reduceMotion: false,
        revealHabitId: p.revealHabitId as never,
        setJustCreatedHabitId,
      }),
    { initialProps: { habits, revealHabitId } }
  );
  return { clearRevealHabit, hook, listRef, setJustCreatedHabitId };
}

describe('useRevealHabitRequest', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('scrolls to the end for the last row, then highlights and clears', () => {
    const s = setup('c');
    expect(s.listRef.current.scrollToEnd).toHaveBeenCalledWith({ animated: true });
    expect(s.setJustCreatedHabitId).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(REVEAL_SETTLE_MS));
    expect(s.setJustCreatedHabitId).toHaveBeenCalledWith('c');
    expect(s.clearRevealHabit).toHaveBeenCalledTimes(1);
  });

  it('uses scrollToIndex for a row that is not last', () => {
    const s = setup('b');
    expect(s.listRef.current.scrollToIndex).toHaveBeenCalledWith(
      expect.objectContaining({ animated: true, index: 1 })
    );
    expect(s.listRef.current.scrollToEnd).not.toHaveBeenCalled();
  });

  it('waits for the row to reach the list, and scrolls only once', () => {
    const s = setup('z');
    expect(s.listRef.current.scrollToEnd).not.toHaveBeenCalled();
    const withRow = [habit('a'), habit('b'), habit('c'), habit('z')];
    s.hook.rerender({ habits: withRow, revealHabitId: 'z' });
    expect(s.listRef.current.scrollToEnd).toHaveBeenCalledTimes(1);
    // A list update mid-scroll must neither rescroll nor cancel the ring.
    s.hook.rerender({ habits: [...withRow], revealHabitId: 'z' });
    expect(s.listRef.current.scrollToEnd).toHaveBeenCalledTimes(1);
    act(() => jest.advanceTimersByTime(REVEAL_SETTLE_MS));
    expect(s.setJustCreatedHabitId).toHaveBeenCalledWith('z');
  });
});
