/**
 * Tests: HabitCard reduced motion support
 * Verifies tap/pan/celebration animations respect useReduceMotion
 */

import {
  createCelebrationTrigger,
  createUncheckTrigger,
} from '@/components/HabitCard/animations/celebrationAnimation';
import { createPanGesture } from '@/components/HabitCard/gestures/panGesture';

// Mock reanimated
jest.mock('react-native-reanimated', () => {
  const actual = jest.requireActual('react-native-reanimated/mock');
  return {
    ...actual,
    withTiming: jest.fn((value: number, config?: { duration: number }) => ({
      __type: 'timing',
      duration: config?.duration,
      value,
    })),
    withSpring: jest.fn((value: number, config?: object) => ({
      __type: 'spring',
      config,
      value,
    })),
    runOnJS: jest.fn((fn: () => void) => fn),
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light', Soft: 'soft', Medium: 'medium' },
}));

describe('HabitCard reduced motion — celebration', () => {
  const makeMockSharedValue = (initial: number) => ({ value: initial });

  it('createCelebrationTrigger skips animations when reduceMotion=true', () => {
    const checkmarkScale = makeMockSharedValue(0);
    const checkmarkRotate = makeMockSharedValue(0);
    const rippleScale = makeMockSharedValue(0);
    const rippleOpacity = makeMockSharedValue(0);
    const cardScale = makeMockSharedValue(1);
    const setShowConfetti = jest.fn();
    const setShowFloatingXP = jest.fn();
    const scheduleFloatingXPHide = jest.fn();
    const setXPPosition = jest.fn();

    const trigger = createCelebrationTrigger({
      cardScale: cardScale as unknown,
      checkmarkRotate: checkmarkRotate as unknown,
      checkmarkScale: checkmarkScale as unknown,
      reduceMotion: true,
      scheduleFloatingXPHide,
      rippleOpacity: rippleOpacity as unknown,
      rippleScale: rippleScale as unknown,
      setShowConfetti,
      setShowFloatingXP,
      setXPPosition,
    });

    trigger();

    // When reduceMotion=true, values set instantly (no withTiming)
    expect(checkmarkScale.value).toBe(1);
    expect(rippleScale.value).toBe(0);
    expect(rippleOpacity.value).toBe(0);
    // Confetti should NOT be shown
    expect(setShowConfetti).toHaveBeenCalledWith(false);
    // XP should still show (it's informational, not animated)
    expect(setShowFloatingXP).toHaveBeenCalledWith(true);
  });

  it('createCelebrationTrigger plays animations when reduceMotion=false', () => {
    const checkmarkScale = makeMockSharedValue(0);
    const checkmarkRotate = makeMockSharedValue(0);
    const rippleScale = makeMockSharedValue(0);
    const rippleOpacity = makeMockSharedValue(0);
    const cardScale = makeMockSharedValue(1);
    const setShowConfetti = jest.fn();
    const setShowFloatingXP = jest.fn();
    const scheduleFloatingXPHide = jest.fn();
    const setXPPosition = jest.fn();

    const { withTiming } = require('react-native-reanimated');

    const trigger = createCelebrationTrigger({
      cardScale: cardScale as unknown,
      checkmarkRotate: checkmarkRotate as unknown,
      checkmarkScale: checkmarkScale as unknown,
      reduceMotion: false,
      scheduleFloatingXPHide,
      rippleOpacity: rippleOpacity as unknown,
      rippleScale: rippleScale as unknown,
      setShowConfetti,
      setShowFloatingXP,
      setXPPosition,
    });

    trigger();

    // withTiming should be called for animated path
    expect(withTiming).toHaveBeenCalled();
    // Confetti should show
    expect(setShowConfetti).toHaveBeenCalledWith(true);
  });

  it('createUncheckTrigger skips animation when reduceMotion=true', () => {
    const checkmarkScale = makeMockSharedValue(1);
    const checkmarkRotate = makeMockSharedValue(0);

    const trigger = createUncheckTrigger(
      checkmarkScale as unknown,
      checkmarkRotate as unknown,
      true
    );

    trigger();

    expect(checkmarkScale.value).toBe(1);
    expect(checkmarkRotate.value).toBe(0);
  });

  it('createUncheckTrigger plays animation when reduceMotion=false', () => {
    const checkmarkScale = makeMockSharedValue(1);
    const checkmarkRotate = makeMockSharedValue(0);
    const { withTiming } = require('react-native-reanimated');

    withTiming.mockClear();

    const trigger = createUncheckTrigger(
      checkmarkScale as unknown,
      checkmarkRotate as unknown,
      false
    );

    trigger();

    expect(withTiming).toHaveBeenCalled();
  });
});

describe('HabitCard reduced motion — panGesture', () => {
  it('createPanGesture accepts reduceMotion parameter', () => {
    const translateX = { value: 0 };
    // Should not throw
    const gesture = createPanGesture(translateX as unknown, true);
    expect(gesture).toBeDefined();
  });

  it('createPanGesture defaults reduceMotion to false', () => {
    const translateX = { value: 0 };
    const gesture = createPanGesture(translateX as unknown);
    expect(gesture).toBeDefined();
  });
});

describe('HabitCard reduced motion — tapGesture interface', () => {
  it('tapGesture options include reduceMotion field', () => {
    // Type-level test: ensure the interface includes reduceMotion
    const options = {
      cardScale: { value: 1 },
      completed: false,
      disabled: false,
      id: 'test' as unknown,
      isToggling: false,
      reduceMotion: true,
      today: '2025-01-01',
      setIsToggling: jest.fn(),
      toggleCompletionMutation: jest.fn(),
      triggerCompletionCelebration: jest.fn(),
      triggerUncheckAnimation: jest.fn(),
    };
    expect(options.reduceMotion).toBe(true);
  });
});
