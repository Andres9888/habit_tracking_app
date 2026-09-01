import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import type { Habit } from '../../../features/habits/types';
import HabitDetailScreen from '../HabitDetailScreen';
import type { DetailFlowSwitchProps } from '../components/DetailFlowSwitch';

jest.mock('../../../components/ErrorBoundary', () => ({
  ScreenErrorBoundary: ({ children }: { children: React.ReactNode }) =>
    children,
}));

jest.mock('../../../theme', () => ({
  useThemeColors: () => ({
    colors: { background: '#F5F1ED' },
  }),
}));

jest.mock('../../../lib/queryCache', () => ({
  useCachedQuery: () => undefined,
}));

jest.mock('../useHabitDetailScreenState', () => ({
  useHabitDetailScreenState: () => ({
    bestStreak: 0,
    completedDates: new Set<string>(),
    currentStreak: 0,
    isCompletedToday: false,
    pendingArchive: false,
    pendingDelete: false,
    pendingToggleDate: null,
    setPendingArchive: jest.fn(),
    setPendingDelete: jest.fn(),
  }),
}));

jest.mock('../useCalendarHandlers', () => ({
  useCalendarHandlers: () => ({
    handleCalendarDayPress: jest.fn(),
    handleConfirmArchive: jest.fn(),
    handleConfirmDelete: jest.fn(),
    handleUndoArchive: jest.fn(),
    handleUndoDelete: jest.fn(),
  }),
}));

jest.mock('../useDayNotes', () => ({
  useDayNotes: () => ({
    noteFor: () => '',
    notes: {},
    saveNote: jest.fn(),
  }),
}));

jest.mock('../components', () => ({
  DetailBandHeader: ({
    isTitlePinned,
    title,
  }: {
    isTitlePinned: boolean;
    title: string;
  }) => {
    const { Text: MockText } = require('react-native');
    return isTitlePinned ? (
      <MockText testID='pinned-title'>{title}</MockText>
    ) : null;
  },
  DetailLoadingState: () => null,
  getHabitDisplayName: (habit: Habit) => habit.name,
  HabitDetailModals: () => null,
}));

jest.mock('../components/DetailFlowSwitch', () => ({
  DetailFlowSwitch: ({
    habit,
    onOpenHistory,
    onPinnedChange,
    route,
  }: DetailFlowSwitchProps) => {
    const {
      Pressable: MockPressable,
      Text: MockText,
    } = require('react-native');
    return route === 'detail' ? (
      <>
        <MockText testID='hero-title'>{habit.name}</MockText>
        <MockPressable
          testID='pin-title'
          onPress={() => onPinnedChange(true)}
        />
        <MockPressable testID='open-history' onPress={() => onOpenHistory()} />
      </>
    ) : null;
  },
}));

jest.mock('../components/FlowHeader', () => ({
  FlowHeader: ({ onBack }: { onBack: () => void }) => {
    const { Pressable: MockPressable } = require('react-native');
    return <MockPressable testID='flow-back' onPress={onBack} />;
  },
}));

jest.mock('../components/NoteSheet', () => ({
  NoteSheet: () => null,
}));

const habit = {
  _id: 'habit_1',
  bestStreak: 0,
  currentStreak: 0,
  name: 'Blue Space Time',
} as unknown as Habit;

describe('HabitDetailScreen header lifecycle', () => {
  it('does not restore a stale pinned title when returning to Detail', () => {
    const screen = render(
      <HabitDetailScreen habit={habit} visible onClose={jest.fn()} />
    );

    fireEvent.press(screen.getByTestId('pin-title'));
    fireEvent.press(screen.getByTestId('open-history'));
    fireEvent.press(screen.getByTestId('flow-back'));

    expect(screen.getAllByText('Blue Space Time')).toHaveLength(1);
    expect(screen.queryByTestId('pinned-title')).toBeNull();
    expect(screen.getByTestId('hero-title')).toBeTruthy();
  });

  it('clears a pinned title when the modal closes and reopens', () => {
    const onClose = jest.fn();
    const screen = render(
      <HabitDetailScreen habit={habit} visible onClose={onClose} />
    );

    fireEvent.press(screen.getByTestId('pin-title'));
    expect(screen.queryByTestId('pinned-title')).not.toBeNull();

    screen.rerender(
      <HabitDetailScreen habit={habit} visible={false} onClose={onClose} />
    );
    screen.rerender(
      <HabitDetailScreen habit={habit} visible onClose={onClose} />
    );

    expect(screen.queryByTestId('pinned-title')).toBeNull();
    expect(screen.getAllByText('Blue Space Time')).toHaveLength(1);
  });
});
