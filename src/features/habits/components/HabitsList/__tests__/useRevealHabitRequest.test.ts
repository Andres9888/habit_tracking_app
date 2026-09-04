import { act, renderHook } from '@testing-library/react-native';
import {
  REVEAL_JUMP_MS,
  REVEAL_SETTLE_MS,
  useRevealHabitRequest,
} from '../useRevealHabitRequest';

const habit = (id: string) => ({ _id: id as never, name: `Habit ${id}` });
const ROW = 100;

function setup(
  revealHabitId: string | null,
  habits = [habit('a'), habit('b'), habit('c')]
) {
  const listRef = {
    current: { scrollToIndex: jest.fn(), scrollToOffset: jest.fn() },
  };
  const clearRevealHabit = jest.fn();
  const setJustCreatedHabitId = jest.fn();
  const hook = renderHook(
    (p: { habits: typeof habits; revealHabitId: string | null }) =>
      useRevealHabitRequest({
        clearRevealHabit,
        estimatedRowLength: ROW,
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

  it('jumps by estimate, aligns exactly, then highlights and clears', () => {
    const s = setup('c');
    expect(s.listRef.current.scrollToOffset).toHaveBeenCalledWith({
      animated: true,
      offset: 2 * ROW,
    });
    expect(s.listRef.current.scrollToIndex).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(REVEAL_JUMP_MS));
    expect(s.listRef.current.scrollToIndex).toHaveBeenCalledWith(
      expect.objectContaining({ animated: true, index: 2 })
    );
    expect(s.setJustCreatedHabitId).not.toHaveBeenCalled();

    act(() => jest.advanceTimersByTime(REVEAL_SETTLE_MS));
    expect(s.setJustCreatedHabitId).toHaveBeenCalledWith('c');
    expect(s.clearRevealHabit).toHaveBeenCalledTimes(1);
  });

  it('waits for the row to reach the list, and scrolls only once', () => {
    const s = setup('z');
    expect(s.listRef.current.scrollToOffset).not.toHaveBeenCalled();
    const withRow = [habit('a'), habit('b'), habit('c'), habit('z')];
    s.hook.rerender({ habits: withRow, revealHabitId: 'z' });
    expect(s.listRef.current.scrollToOffset).toHaveBeenCalledTimes(1);
    // A list update mid-scroll must neither rescroll nor cancel the steps.
    s.hook.rerender({ habits: [...withRow], revealHabitId: 'z' });
    expect(s.listRef.current.scrollToOffset).toHaveBeenCalledTimes(1);
    act(() => jest.advanceTimersByTime(REVEAL_JUMP_MS + REVEAL_SETTLE_MS));
    expect(s.listRef.current.scrollToIndex).toHaveBeenCalledTimes(1);
    expect(s.setJustCreatedHabitId).toHaveBeenCalledWith('z');
  });

  it('clearing the request cancels pending steps', () => {
    const s = setup('c');
    s.hook.rerender({ habits: [habit('a'), habit('b'), habit('c')], revealHabitId: null });
    act(() => jest.advanceTimersByTime(REVEAL_JUMP_MS + REVEAL_SETTLE_MS));
    expect(s.listRef.current.scrollToIndex).not.toHaveBeenCalled();
    expect(s.setJustCreatedHabitId).not.toHaveBeenCalled();
  });
});
