import { act, renderHook } from '@testing-library/react-native';
import { OPTIMISTIC_HABIT_ID_PREFIX } from '../hooks/optimisticHabitCreationStore';
import { useOpenCreatedHabitDetail } from '../components/CreatedHabitDetailOpener';

const habit = (id: string) => ({ _id: id as never, name: `Habit ${id}` });
type Request = { id: string; notBefore: number } | null;

function setup(request: Request, habits = [habit('srv-1')]) {
  const clearCreatedHabitDetail = jest.fn();
  const openHabitDetail = jest.fn();
  const hook = renderHook(
    (p: { habits: typeof habits; request: Request }) =>
      useOpenCreatedHabitDetail({
        clearCreatedHabitDetail,
        createdHabitDetailRequest: p.request,
        habits: p.habits,
        openHabitDetail,
      } as never),
    { initialProps: { habits, request } }
  );
  return { clearCreatedHabitDetail, hook, openHabitDetail };
}

describe('useOpenCreatedHabitDetail', () => {
  beforeEach(() => jest.useFakeTimers({ now: 1000 }));
  afterEach(() => jest.useRealTimers());

  it('opens the detail screen once the server habit is listed and the form has exited', () => {
    const s = setup({ id: 'srv-1', notBefore: 1300 });
    act(() => jest.advanceTimersByTime(299));
    expect(s.openHabitDetail).not.toHaveBeenCalled();
    act(() => jest.advanceTimersByTime(1));
    expect(s.openHabitDetail).toHaveBeenCalledWith(habit('srv-1'));
    expect(s.clearCreatedHabitDetail).toHaveBeenCalledTimes(1);
  });

  it('never opens on the optimistic temp id', () => {
    const tempId = `${OPTIMISTIC_HABIT_ID_PREFIX}1_abc`;
    const s = setup({ id: tempId, notBefore: 0 }, [habit(tempId)]);
    act(() => jest.advanceTimersByTime(5000));
    expect(s.openHabitDetail).not.toHaveBeenCalled();
  });

  it('waits for habits.list to deliver the server habit', () => {
    const s = setup({ id: 'srv-9', notBefore: 0 }, [habit('srv-1')]);
    act(() => jest.advanceTimersByTime(1000));
    expect(s.openHabitDetail).not.toHaveBeenCalled();
    s.hook.rerender({
      habits: [habit('srv-1'), habit('srv-9')],
      request: { id: 'srv-9', notBefore: 0 },
    });
    act(() => jest.advanceTimersByTime(0));
    expect(s.openHabitDetail).toHaveBeenCalledWith(habit('srv-9'));
  });
});
