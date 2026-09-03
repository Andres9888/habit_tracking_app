import React, { useCallback, useState } from 'react';
import { act, cleanup, fireEvent, render } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';

import type { Id } from '../../../../../convex/_generated/dataModel';
import { HabitChainVisualizer } from '../../../../components/HabitChainVisualizer';
import {
  countStyleMatches,
  type JsonNode,
} from '../../../../components/HabitChainVisualizer/__tests__/HabitDayToggle.testUtils';
import {
  optimisticStore,
  useOptimisticToggleMutation,
  usePendingToggles,
} from '../../../../lib/optimistic';
import { buildCompletedDatesByHabit } from '../useHabitsTracking.completions';

const HABIT_ID = 'habit_second_checkbox' as Id<'habits'>;
const WEEK_DATES = ['2026-08-29', '2026-08-30'];
const FIRST_DAY_TRACKING = [
  { completed: true, date: WEEK_DATES[0], habitId: HABIT_ID },
];
let authoritativeSecondDayCompleted = true;
const serverMutationSpy = jest.fn();

function CheckboxHarness() {
  const [tracking, setTracking] = useState(FIRST_DAY_TRACKING);
  const pendingToggles = usePendingToggles();
  const completedDates = buildCompletedDatesByHabit(tracking, pendingToggles);
  const getCurrentStatus = useCallback(
    (habitId: Id<'habits'>, date: string) =>
      completedDates.get(habitId)?.has(date) ?? false,
    [completedDates]
  );
  const serverMutation = useCallback(
    async (args: {
      completed?: boolean;
      date: string;
      habitId: Id<'habits'>;
    }) => {
      serverMutationSpy(args);
      authoritativeSecondDayCompleted =
        args.completed ?? !authoritativeSecondDayCompleted;
      setTracking(
        authoritativeSecondDayCompleted
          ? [
              ...FIRST_DAY_TRACKING,
              { completed: true, date: WEEK_DATES[1], habitId: HABIT_ID },
            ]
          : [...FIRST_DAY_TRACKING]
      );
    },
    []
  );
  const toggle = useOptimisticToggleMutation(serverMutation, getCurrentStatus, {
    isOnline: true,
  });
  const weekStatus = WEEK_DATES.map((date) =>
    completedDates.get(HABIT_ID)?.has(date) ? 'done' : 'planned'
  ) as ('done' | 'planned')[];

  return (
    <HabitChainVisualizer
      accentColor='#3B82F6'
      celebrationsEnabled={false}
      habitId={HABIT_ID}
      onToggle={(args) => void toggle(args)}
      reduceMotionPreference
      weekDateStrings={WEEK_DATES}
      weekStatus={weekStatus}
    />
  );
}

describe('confirmed checkbox visual state', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    optimisticStore.reset();
    authoritativeSecondDayCompleted = true;
    serverMutationSpy.mockClear();
  });

  afterEach(() => {
    cleanup();
    optimisticStore.reset();
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  it('commits completed visuals atomically when an animation frame stalls', () => {
    // A stalled timing value must not reach the frame: the completed fill is a
    // plain React style, not an interpolation of an animated progress value.
    jest.spyOn(Reanimated, 'withTiming').mockReturnValue(0.15);
    const tree = render(<CheckboxHarness />).toJSON() as JsonNode;

    // '#B87333' is the copper tier fill of a completed day cell.
    expect(
      countStyleMatches(tree, { backgroundColor: '#B87333' })
    ).toBeGreaterThan(0);
  });

  it('keeps the second checkbox checked when its cached status was stale', async () => {
    const view = render(<CheckboxHarness />);
    fireEvent.press(view.getAllByRole('checkbox')[1]);
    await act(async () => undefined);

    expect(
      view.getAllByRole('checkbox')[1].props.accessibilityState.checked
    ).toBe(true);
    expect(serverMutationSpy).toHaveBeenCalledWith({
      completed: true,
      date: WEEK_DATES[1],
      habitId: HABIT_ID,
    });

    act(() => {
      jest.advanceTimersByTime(300);
    });

    expect(
      view.getAllByRole('checkbox')[1].props.accessibilityState.checked
    ).toBe(true);
  });
});
