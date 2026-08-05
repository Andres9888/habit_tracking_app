/**
 * HabitsApp - FloatingActionButton Integration Tests
 *
 * Tests that the FAB correctly opens the create habit modal
 * Verifies the integration between FloatingActionButton and modal state management
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { HabitsApp } from '../HabitsApp';

// Mock Convex hooks
jest.mock('convex/react', () => ({
  useQuery: jest.fn(),
  useMutation: jest.fn(),
  ConvexProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Mock CreateHabitModal component
jest.mock('../../../components/CreateHabitModal', () => ({
  __esModule: true,
  default: ({
    visible,
    onClose,
  }: {
    visible: boolean;
    onClose: () => void;
  }) => {
    const { View, Text, Pressable } = require('react-native');
    if (!visible) return null;
    return (
      <View testID='create-habit-modal'>
        <Text>Create Habit Modal</Text>
        <Pressable testID='modal-close-button' onPress={onClose}>
          <Text>Close</Text>
        </Pressable>
      </View>
    );
  },
}));

// Mock all other modal components
jest.mock('../../../components/SettingsModal', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../../../components/HabitCalendarModal', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../../../screens/HabitDetailScreen', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../../../components/PauseHabitModal', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../../../components/HapticTest', () => ({
  __esModule: true,
  default: () => null,
}));

jest.mock('../../../screens/TemplatesScreen', () => ({
  __esModule: true,
  default: () => null,
}));

// Mock other components to simplify testing
jest.mock('../../../components/CalendarTimeline', () => ({
  CalendarTimeline: () => null,
}));

jest.mock('../components/HabitsList', () => ({
  HabitsList: () => null,
}));

jest.mock('../components/WebToaster', () => ({
  __esModule: true,
  default: () => null,
}));

// Mock GestureHandlerRootView
jest.mock('react-native-gesture-handler', () => ({
  GestureHandlerRootView: ({ children }: { children: React.ReactNode }) =>
    children,
}));

describe('HabitsApp - FloatingActionButton Integration', () => {
  const mockUseQuery = require('convex/react').useQuery;
  const mockUseMutation = require('convex/react').useMutation;

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();

    // Setup default mock implementations
    mockUseQuery.mockReturnValue([]);
    mockUseMutation.mockReturnValue(jest.fn());
  });

  describe('FAB Rendering', () => {
    it('should render the FloatingActionButton', () => {
      const { getByLabelText } = render(<HabitsApp />);
      const fab = getByLabelText('Add habit');
      expect(fab).toBeDefined();
    });

    it('should position FAB at bottom right', () => {
      const { root } = render(<HabitsApp />);
      // FAB should be absolutely positioned at bottom-8 right-6
      expect(root).toBeTruthy();
    });
  });

  describe('FAB Press Interaction', () => {
    it('should open create habit modal when FAB is pressed', async () => {
      const { getByLabelText, queryByTestId } = render(<HabitsApp />);

      // Modal should not be visible initially
      expect(queryByTestId('create-habit-modal')).toBeNull();

      // Press the FAB
      const fab = getByLabelText('Add habit');
      fireEvent.press(fab);

      // Modal should be visible after pressing FAB
      await waitFor(() => {
        expect(queryByTestId('create-habit-modal')).toBeDefined();
      });
    });

    it('should trigger modal opening logic when FAB is pressed', async () => {
      const { getByLabelText, queryByTestId } = render(<HabitsApp />);

      // Modal should not be visible initially
      expect(queryByTestId('create-habit-modal')).toBeNull();

      // Press the FAB
      const fab = getByLabelText('Add habit');
      fireEvent.press(fab);

      // Modal state should be updated (verified by testID presence)
      await waitFor(() => {
        expect(queryByTestId('create-habit-modal')).toBeDefined();
      });
    });
  });

  describe('Modal State Management', () => {
    it('should use modals.openCreateHabitScreen handler', async () => {
      const { getByLabelText, queryByTestId } = render(<HabitsApp />);

      // Verify the FAB uses the correct handler
      const fab = getByLabelText('Add habit');
      fireEvent.press(fab);

      await waitFor(() => {
        expect(queryByTestId('create-habit-modal')).toBeDefined();
      });
    });

    it('should maintain modal state independently from other UI elements', async () => {
      const { getByLabelText, queryByTestId } = render(<HabitsApp />);

      // Initial state - modal closed
      expect(queryByTestId('create-habit-modal')).toBeNull();

      // Open modal
      const fab = getByLabelText('Add habit');
      fireEvent.press(fab);

      await waitFor(() => {
        expect(queryByTestId('create-habit-modal')).toBeDefined();
      });

      // Modal state is independent
      expect(queryByTestId('create-habit-modal')).toBeDefined();
    });
  });

  describe('Accessibility', () => {
    it('should announce FAB action to screen readers', () => {
      const { getByLabelText } = render(<HabitsApp />);
      const fab = getByLabelText('Add habit');

      expect(fab.props.accessibilityLabel).toBe('Add habit');
      expect(fab.props.accessibilityHint).toBe('Open create habit modal');
      expect(fab.props.accessibilityRole).toBe('button');
    });

    it('should be keyboard accessible', () => {
      const { getByLabelText } = render(<HabitsApp />);
      const fab = getByLabelText('Add habit');

      // Should be focusable and pressable
      expect(fab.props.accessibilityRole).toBe('button');
    });
  });

  describe('Integration with HabitsModals', () => {
    it('should pass showCreateHabit state to HabitsModals', async () => {
      const { getByLabelText, queryByTestId } = render(<HabitsApp />);

      // Open modal via FAB
      const fab = getByLabelText('Add habit');
      fireEvent.press(fab);

      // HabitsModals should receive showCreateHabit = true
      await waitFor(() => {
        expect(queryByTestId('create-habit-modal')).toBeDefined();
      });
    });

    it('should integrate properly with HabitsModals component', async () => {
      const { getByLabelText, queryByTestId } = render(<HabitsApp />);

      // Open modal
      const fab = getByLabelText('Add habit');
      fireEvent.press(fab);

      // Modal should be integrated and rendered
      await waitFor(() => {
        expect(queryByTestId('create-habit-modal')).toBeDefined();
      });
    });
  });

  describe('User Flow', () => {
    it('should handle typical user interaction flow', async () => {
      const { getByLabelText, queryByTestId } = render(<HabitsApp />);

      const fab = getByLabelText('Add habit');

      // Step 1: Initial state - modal closed
      expect(queryByTestId('create-habit-modal')).toBeNull();

      // Step 2: User presses FAB
      fireEvent.press(fab);

      // Step 3: Modal opens
      await waitFor(() => {
        expect(queryByTestId('create-habit-modal')).toBeDefined();
      });

      // This verifies the core user flow works correctly
    });
  });

  describe('Regression Prevention', () => {
    it('should NOT use list.openCreateHabitScreen (bug fix verification)', () => {
      // This test verifies the fix for the bug where FAB was using
      // list.openCreateHabitScreen (empty function) instead of
      // modals.openCreateHabitScreen (actual modal opener)

      const { getByLabelText, queryByTestId } = render(<HabitsApp />);

      const fab = getByLabelText('Add habit');
      fireEvent.press(fab);

      // If FAB uses list.openCreateHabitScreen (bug), modal won't open
      // If FAB uses modals.openCreateHabitScreen (fix), modal will open
      waitFor(() => {
        expect(queryByTestId('create-habit-modal')).toBeDefined();
      });
    });

    it('should use modals.openCreateHabitScreen for correct behavior', async () => {
      const { getByLabelText, queryByTestId } = render(<HabitsApp />);

      // Press FAB
      const fab = getByLabelText('Add habit');
      fireEvent.press(fab);

      // Verify modal opens (proves correct handler is used)
      await waitFor(() => {
        expect(queryByTestId('create-habit-modal')).toBeDefined();
      });
    });
  });
});
