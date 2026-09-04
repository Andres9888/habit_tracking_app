import { act, renderHook } from '@testing-library/react-native';
import { useOpenCreatedHabitDetail } from '../components/CreatedHabitDetailOpener';
import { buildModalsSettersArg } from '../hooks/buildModalsSettersArg';
import { buildModalsStateReturnValue } from '../hooks/buildModalsStateReturnValue';
import { useHabitSelectionState } from '../hooks/useHabitSelectionState';
import { useHabitsModalsHandlers } from '../hooks/useHabitsModalsHandlers';
import { useModalVisibilityState } from '../hooks/useModalVisibilityState';
import { OPTIMISTIC_HABIT_ID_PREFIX } from '../hooks/optimisticHabitCreationStore';
import type { Habit } from '../types';

const created = { _id: 'server-created', name: 'Created habit' } as Habit;
const other = { _id: 'server-other', name: 'Other habit' } as Habit;
const habits = [created, other];

function setup() {
  return renderHook(() => {
    const visibility = useModalVisibilityState();
    const selection = useHabitSelectionState();
    const handlers = useHabitsModalsHandlers(
      buildModalsSettersArg(visibility, selection),
      { habits } as never
    );
    const modals = buildModalsStateReturnValue(
      visibility,
      selection,
      handlers,
      { habits } as never
    );
    useOpenCreatedHabitDetail(modals);
    return modals;
  });
}

describe('created habit navigation', () => {
  beforeEach(() => jest.useFakeTimers({ now: 1000 }));
  afterEach(() => jest.useRealTimers());

  it('keeps the habit the user opened instead of replacing it after creation', () => {
    const { result } = setup();
    act(() => result.current.requestCreatedHabitDetail(created._id, 2070));
    act(() => result.current.openHabitDetail(other));
    act(() => jest.advanceTimersByTime(1070));
    expect(result.current.selectedHabit).toBe(other);
    expect(result.current.createdHabitDetailRequest).toBeNull();
  });

  it.each([
    ['openCreateHabitScreen', 'closeCreateHabit'],
    ['openSettings', 'closeSettings'],
    ['openTemplatesScreen', 'closeTemplatesScreen'],
  ] as const)(
    'cancels pending creation when the user calls %s',
    (open, close) => {
      const { result } = setup();
      const tempId = `${OPTIMISTIC_HABIT_ID_PREFIX}pending` as Habit['_id'];
      act(() => result.current.requestCreatedHabitDetail(tempId, 2070));
      act(() => result.current[open]());
      expect(result.current.createdHabitDetailRequest).toBeNull();
      act(() => result.current[close]());
      act(() => result.current.rekeyCreatedHabitDetail(tempId, created._id));
      act(() => jest.advanceTimersByTime(1070));
      expect(result.current.showHabitDetail).toBe(false);
      expect(result.current.selectedHabit).toBeNull();
    }
  );

  it('does not open Detail over a reopened Add Habit form after sync', () => {
    const { result } = setup();
    act(() => result.current.requestCreatedHabitDetail(created._id, 2070));
    act(() => result.current.openCreateHabitScreen());
    act(() => jest.advanceTimersByTime(1070));
    expect(result.current.showCreateHabit).toBe(true);
    expect(result.current.showHabitDetail).toBe(false);
  });
});
