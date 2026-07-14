import React from 'react';
import { render, fireEvent, act } from '@testing-library/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { CompleteUndoToast } from '../CompleteUndoToast';

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, right: 0, bottom: 34, left: 0 }),
}));

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return {
    ...Reanimated,
    useAnimatedStyle: () => ({}),
    useSharedValue: (initial: number) => ({ value: initial }),
    withSpring: (toValue: number) => toValue,
    withTiming: (toValue: number) => toValue,
    withSequence: (toValue: number) => toValue,
    runOnJS: (fn: () => void) => fn,
    Easing: {
      linear: 'linear',
      cubic: (t: number) => t,
      out: (fn: unknown) => fn,
      in: (fn: unknown) => fn,
    },
  };
});

const TestWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => (
  <GestureHandlerRootView style={{ flex: 1 }}>{children}</GestureHandlerRootView>
);

describe('CompleteUndoToast', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('renders nothing when not visible', () => {
    const { queryByText } = render(
      <TestWrapper>
        <CompleteUndoToast
          message='Morning Run done!'
          visible={false}
          onUndo={() => {}}
        />
      </TestWrapper>
    );
    expect(queryByText('Morning Run done!')).toBeNull();
  });

  it('renders the message and an Undo action when visible', () => {
    const { getByText } = render(
      <TestWrapper>
        <CompleteUndoToast
          message='Morning Run done!'
          visible={true}
          onUndo={() => {}}
        />
      </TestWrapper>
    );
    expect(getByText('Morning Run done!')).toBeTruthy();
    expect(getByText('UNDO')).toBeTruthy();
  });

  it('calls onUndo when the undo button is pressed', () => {
    const onUndo = jest.fn();
    const { getByLabelText } = render(
      <TestWrapper>
        <CompleteUndoToast message='Done!' visible={true} onUndo={onUndo} />
      </TestWrapper>
    );
    fireEvent.press(getByLabelText('Undo, mark as not done'));
    expect(onUndo).toHaveBeenCalledTimes(1);
  });

  it('renders the repeat-tap message the same way as the fresh-mark message', () => {
    const { getByText } = render(
      <TestWrapper>
        <CompleteUndoToast
          message='Already done today'
          visible={true}
          onUndo={() => {}}
        />
      </TestWrapper>
    );
    expect(getByText('Already done today')).toBeTruthy();
    expect(getByText('UNDO')).toBeTruthy();
  });

  it('auto-dismisses after the given duration', () => {
    const onDismiss = jest.fn();
    render(
      <TestWrapper>
        <CompleteUndoToast
          duration={3200}
          message='Done!'
          visible={true}
          onDismiss={onDismiss}
          onUndo={() => {}}
        />
      </TestWrapper>
    );
    act(() => {
      jest.advanceTimersByTime(3100);
    });
    expect(onDismiss).not.toHaveBeenCalled();
    // The animation hook schedules its own dismiss-callback timer (300ms)
    // after the visible duration elapses, so onDismiss lands a bit later.
    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });

  it('has correct accessibility attributes', () => {
    const { getByLabelText } = render(
      <TestWrapper>
        <CompleteUndoToast message='Done!' visible={true} onUndo={() => {}} />
      </TestWrapper>
    );
    const toast = getByLabelText('Done! Double tap to undo.');
    expect(toast.props.accessibilityRole).toBe('alert');
    expect(toast.props.accessibilityLiveRegion).toBe('polite');
  });
});
