/**
 * Regression: the habit Edit screen must mount for every Edit entry point, not
 * only the one inside the Habit Detail modal.
 *
 * `editOverlay` (introduced in 85b4f1d4a) moved <HabitEditScreen> from a
 * top-level sibling into HabitDetailScreen's <Modal>. A React Native <Modal>
 * renders nothing while `visible` is false, so Edit launched from the older
 * quick-actions path — which sets `showEditScreen` without opening Habit
 * Detail — silently mounted nothing.
 */
import React from 'react';
import { Text } from 'react-native';
import { render } from '@testing-library/react-native';
import { CalendarAndDetailModals } from '../CalendarAndDetailModals';
import type { CalendarAndDetailModalsProps } from '../HabitsModals.types';
import type { Id } from '../../../../../../convex/_generated/dataModel';

jest.mock('../../../../../components/ErrorBoundary', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('../../../../../components/HabitCalendarModal', () => ({
  __esModule: true,
  default: () => null,
}));

// Mirrors RN <Modal>: children are not rendered while `visible` is false.
jest.mock('../../../../../screens/HabitDetailScreen', () => ({
  __esModule: true,
  default: ({
    editOverlay,
    visible,
  }: {
    editOverlay?: React.ReactNode;
    visible: boolean;
  }) => (visible ? <>{editOverlay}</> : null),
}));

jest.mock('../../../../../screens/HabitEditScreen', () => {
  const { Text: RNText } = require('react-native');
  return {
    __esModule: true,
    default: ({ visible }: { visible: boolean }) =>
      visible ? <RNText testID='habit-edit-screen'>edit</RNText> : null,
  };
});

const habit = {
  _id: 'habit_1' as Id<'habits'>,
  name: 'Wake-Up Movement',
} as CalendarAndDetailModalsProps['habitToEdit'];

function renderModals(overrides: Partial<CalendarAndDetailModalsProps> = {}) {
  const props: CalendarAndDetailModalsProps = {
    closeEditScreen: jest.fn(),
    closeHabitCalendar: jest.fn(),
    closeHabitDetail: jest.fn(),
    getStreak: jest.fn(() => 0),
    habitToEdit: habit,
    handleArchive: jest.fn(),
    onDeleteHabit: jest.fn(),
    openEditHabit: jest.fn(),
    openHabitCalendar: jest.fn(),
    openHabitDetail: jest.fn(),
    selectedHabit: null,
    showEditScreen: false,
    showHabitCalendar: false,
    showHabitDetail: false,
    toggleHabit: jest.fn(),
    tracking: [],
    ...overrides,
  } as CalendarAndDetailModalsProps;
  return render(<CalendarAndDetailModals {...props} />);
}

describe('CalendarAndDetailModals edit entry points', () => {
  it('mounts the edit screen when Edit is opened with Habit Detail closed', () => {
    const { queryByTestId } = renderModals({
      showEditScreen: true,
      showHabitDetail: false,
    });

    expect(queryByTestId('habit-edit-screen')).not.toBeNull();
  });

  it('still mounts the edit screen when Edit is opened from Habit Detail', () => {
    const { queryByTestId } = renderModals({
      selectedHabit: habit,
      showEditScreen: true,
      showHabitDetail: true,
    });

    expect(queryByTestId('habit-edit-screen')).not.toBeNull();
  });

  it('mounts nothing while the edit screen is closed', () => {
    const { queryByTestId } = renderModals({ showEditScreen: false });

    expect(queryByTestId('habit-edit-screen')).toBeNull();
  });

  it('does not mount two edit screens when Habit Detail is open', () => {
    const { queryAllByTestId } = renderModals({
      selectedHabit: habit,
      showEditScreen: true,
      showHabitDetail: true,
    });

    expect(queryAllByTestId('habit-edit-screen')).toHaveLength(1);
  });
});
