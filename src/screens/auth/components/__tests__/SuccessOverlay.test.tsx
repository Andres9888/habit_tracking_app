import { render, act } from '@testing-library/react-native';
import { SuccessOverlay } from '../SuccessOverlay';

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  return {
    ...Reanimated,
    useSharedValue: (initialValue: number) => ({ value: initialValue }),
    useAnimatedStyle: (callback: () => object) => callback(),
    withTiming: (toValue: number) => toValue,
    withSpring: (toValue: number) => toValue,
    withDelay: (_: number, animation: unknown) => animation,
    withSequence: (...args: unknown[]) => args[args.length - 1],
    runOnJS: (fn: Function) => fn,
  };
});

describe('SuccessOverlay', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('Rendering', () => {
    it('renders nothing when not visible', () => {
      const { queryByText, queryByRole } = render(
        <SuccessOverlay visible={false} />
      );

      expect(queryByText('✓')).toBeNull();
      expect(queryByText('Welcome back!')).toBeNull();
      expect(queryByRole('alert')).toBeNull();
    });

    it('renders overlay when visible', () => {
      const { getByText, getByRole } = render(
        <SuccessOverlay visible={true} />
      );

      expect(getByText('✓')).toBeTruthy();
      expect(getByText('Welcome back!')).toBeTruthy();
      expect(getByRole('alert')).toBeTruthy();
    });

    it('has correct accessibility label', () => {
      const { getByLabelText } = render(<SuccessOverlay visible={true} />);

      expect(getByLabelText('Sign in successful')).toBeTruthy();
    });

    it('has correct accessibility role', () => {
      const { getByRole } = render(<SuccessOverlay visible={true} />);

      expect(getByRole('alert')).toBeTruthy();
    });
  });

  describe('Animation callback', () => {
    it('calls onAnimationComplete after animation duration', () => {
      const onAnimationComplete = jest.fn();

      render(
        <SuccessOverlay visible={true} onAnimationComplete={onAnimationComplete} />
      );

      expect(onAnimationComplete).not.toHaveBeenCalled();

      // Fast-forward past animation duration (1500ms)
      act(() => {
        jest.advanceTimersByTime(1500);
      });

      expect(onAnimationComplete).toHaveBeenCalledTimes(1);
    });

    it('does not call onAnimationComplete when not visible', () => {
      const onAnimationComplete = jest.fn();

      render(
        <SuccessOverlay visible={false} onAnimationComplete={onAnimationComplete} />
      );

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      expect(onAnimationComplete).not.toHaveBeenCalled();
    });

    it('cleans up timer when component unmounts', () => {
      const onAnimationComplete = jest.fn();

      const { unmount } = render(
        <SuccessOverlay visible={true} onAnimationComplete={onAnimationComplete} />
      );

      // Unmount before animation completes
      unmount();

      act(() => {
        jest.advanceTimersByTime(2000);
      });

      // Callback should not be called after unmount
      expect(onAnimationComplete).not.toHaveBeenCalled();
    });
  });

  describe('Visibility transitions', () => {
    it('shows content when becoming visible', () => {
      const { queryByText, rerender } = render(
        <SuccessOverlay visible={false} />
      );

      expect(queryByText('✓')).toBeNull();

      rerender(<SuccessOverlay visible={true} />);

      expect(queryByText('✓')).toBeTruthy();
      expect(queryByText('Welcome back!')).toBeTruthy();
    });

    it('hides content when becoming invisible', () => {
      const { queryByText, rerender } = render(
        <SuccessOverlay visible={true} />
      );

      expect(queryByText('✓')).toBeTruthy();

      rerender(<SuccessOverlay visible={false} />);

      expect(queryByText('✓')).toBeNull();
      expect(queryByText('Welcome back!')).toBeNull();
    });
  });

  describe('Content', () => {
    it('displays checkmark icon', () => {
      const { getByText } = render(<SuccessOverlay visible={true} />);

      expect(getByText('✓')).toBeTruthy();
    });

    it('displays welcome message', () => {
      const { getByText } = render(<SuccessOverlay visible={true} />);

      expect(getByText('Welcome back!')).toBeTruthy();
    });
  });
});
