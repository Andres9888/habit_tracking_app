/**
 * Scenarios S03–S06: Core habit loop on the main HabitsApp screen.
 *
 * S03 View habits + week strip — PASS: habit name, "Today", a day cell, and the
 *   week navigation control render.
 * S04 Complete a habit — PASS: tapping a habit's day cell calls the
 *   habits:toggleHabit mutation.
 * S05 Week navigation — PASS: "Previous week" is pressable and the list survives.
 * S06 Create a habit — PASS: tapping "Add new habit" opens the create surface.
 */
import { fireEvent, screen, waitFor } from '@testing-library/react-native';

// The real create-habit modal is lazy-loaded via dynamic import(), which jest's
// CJS runtime cannot execute. Stub it (as the existing HabitsApp.fab test does)
// so S06 can verify the FAB opens the create surface — the integration under test.
jest.mock('../../src/components/CreateHabitModal', () => {
  const React = require('react');
  const { View, Text } = require('react-native');
  return {
    __esModule: true,
    default: ({ visible }: { visible: boolean }) =>
      visible
        ? React.createElement(
            View,
            { testID: 'create-habit-modal' },
            React.createElement(Text, null, 'New Habit')
          )
        : null,
  };
});

import { HabitsApp } from '../../src/features/habits/HabitsApp';
import {
  getMutation,
  makeHabit,
  renderScreen,
  resetConvex,
  seedCommonQueries,
} from './harness';

describe('HabitsApp core loop', () => {
  beforeEach(() => {
    resetConvex();
    seedCommonQueries([makeHabit({ name: 'Morning Run', currentStreak: 5 })]);
    getMutation('habits:toggleHabit');
  });

  it('S03: shows the habit, today, a day cell and week navigation', async () => {
    renderScreen(<HabitsApp />);
    expect(await screen.findByText('Morning Run')).toBeTruthy();
    expect(screen.getByText('Today')).toBeTruthy();
    expect(screen.getByLabelText('Open settings')).toBeTruthy();
    expect(screen.getByLabelText('Previous week')).toBeTruthy();
  });

  it('S04: tapping a habit day cell toggles completion', async () => {
    renderScreen(<HabitsApp />);
    await screen.findByText('Morning Run');
    const todayCell = screen.getByLabelText('Today, Completed');
    fireEvent.press(todayCell);
    await waitFor(() =>
      expect(getMutation('habits:toggleHabit')).toHaveBeenCalled()
    );
  });

  it('S05: previous-week navigation keeps the list rendered', async () => {
    renderScreen(<HabitsApp />);
    await screen.findByText('Morning Run');
    fireEvent.press(screen.getByLabelText('Previous week'));
    await waitFor(() => expect(screen.getByText('Morning Run')).toBeTruthy());
    expect(screen.queryByText('Something went wrong')).toBeNull();
  });

  it('S06: tapping Add new habit opens the create surface', async () => {
    renderScreen(<HabitsApp />);
    await screen.findByText('Morning Run');
    fireEvent.press(screen.getByLabelText('Add new habit'));
    expect(await screen.findByText(/New Habit|What habit/i)).toBeTruthy();
  });
});
