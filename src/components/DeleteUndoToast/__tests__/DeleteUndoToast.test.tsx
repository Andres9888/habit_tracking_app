import React from 'react';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import { DeleteUndoToast } from '../DeleteUndoToast';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Mock safe area insets
jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 34, left: 0 }),
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
    useAnimatedStyle: () => ({}),
    useSharedValue: (initial: number) => ({ value: initial }),
    withSpring: (toValue: number) => toValue,
    withTiming: (toValue: number) => toValue,
    runOnJS: (fn: () => void) => fn,
    Easing: { linear: 'linear' },
  };
});

// Wrapper to provide gesture handler context
const TestWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    {children}
  </GestureHandlerRootView>
);

describe('DeleteUndoToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing when not visible', () => {
    const { queryByText } = render(
      <TestWrapper>
        <DeleteUndoToast
          visible={false}
          itemName="Test Habit"
        />
      </TestWrapper>
    );

    expect(queryByText('Test Habit')).toBeNull();
    expect(queryByText('will be deleted')).toBeNull();
  });

  it('renders correctly when visible', () => {
    const { getByText } = render(
      <TestWrapper>
        <DeleteUndoToast
          visible={true}
          itemName="Test Habit"
        />
      </TestWrapper>
    );

    expect(getByText('"Test Habit"')).toBeTruthy();
    expect(getByText(' will be deleted')).toBeTruthy();
    expect(getByText('UNDO')).toBeTruthy();
  });

  it('calls onUndo when undo button is pressed', () => {
    const onUndo = jest.fn();
    const { getByLabelText } = render(
      <TestWrapper>
        <DeleteUndoToast
          visible={true}
          itemName="Test Habit"
          onUndo={onUndo}
        />
      </TestWrapper>
    );

    const undoButton = getByLabelText('Undo delete');
    fireEvent.press(undoButton);

    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm after duration expires', async () => {
    const onConfirm = jest.fn();
    const duration = 5000;

    render(
      <TestWrapper>
        <DeleteUndoToast
          visible={true}
          itemName="Test Habit"
          duration={duration}
          onConfirm={onConfirm}
        />
      </TestWrapper>
    );

    // Fast-forward time to just before the timeout
    act(() => {
      jest.advanceTimersByTime(duration - 100);
    });
    expect(onConfirm).not.toHaveBeenCalled();

    // Fast-forward past the timeout
    act(() => {
      jest.advanceTimersByTime(200);
    });
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    const { getByLabelText, getByRole } = render(
      <TestWrapper>
        <DeleteUndoToast
          visible={true}
          itemName="My Habit"
        />
      </TestWrapper>
    );

    const toast = getByLabelText('My Habit will be deleted. Tap undo to cancel.');
    expect(toast).toBeTruthy();
    expect(toast.props.accessibilityRole).toBe('alert');
    expect(toast.props.accessibilityLiveRegion).toBe('polite');
  });

  it('clears timeout when unmounted', () => {
    const onConfirm = jest.fn();
    const { unmount } = render(
      <TestWrapper>
        <DeleteUndoToast
          visible={true}
          itemName="Test Habit"
          duration={5000}
          onConfirm={onConfirm}
        />
      </TestWrapper>
    );

    unmount();

    // Fast-forward past the timeout
    act(() => {
      jest.advanceTimersByTime(6000);
    });

    // onConfirm should not be called because component was unmounted
    expect(onConfirm).not.toHaveBeenCalled();
  });

  it('resets and restarts timer when visibility changes', () => {
    const onConfirm = jest.fn();
    const duration = 5000;

    const { rerender } = render(
      <TestWrapper>
        <DeleteUndoToast
          visible={false}
          itemName="Test Habit"
          duration={duration}
          onConfirm={onConfirm}
        />
      </TestWrapper>
    );

    // Make visible
    rerender(
      <TestWrapper>
        <DeleteUndoToast
          visible={true}
          itemName="Test Habit"
          duration={duration}
          onConfirm={onConfirm}
        />
      </TestWrapper>
    );

    // Wait half the duration
    act(() => {
      jest.advanceTimersByTime(2500);
    });
    expect(onConfirm).not.toHaveBeenCalled();

    // Wait for full duration
    act(() => {
      jest.advanceTimersByTime(3000);
    });
    expect(onConfirm).toHaveBeenCalledTimes(1);
  });
});
