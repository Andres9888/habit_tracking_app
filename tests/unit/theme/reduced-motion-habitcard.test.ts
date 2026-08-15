/**
 * HabitCard reduced motion — celebration + pan
 */

import {
  createCelebrationTrigger,
  createUncheckTrigger,
} from '@/components/HabitCard/animations/celebrationAnimation';
import { createPanGesture } from '@/components/HabitCard/gestures/panGesture';

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
    withSequence: jest.fn((...args: unknown[]) => args),
    runOnJS: jest.fn((fn: () => void) => fn),
  };
});

jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn().mockResolvedValue(undefined),
  ImpactFeedbackStyle: { Light: 'light', Soft: 'soft', Medium: 'medium' },
}));

const makeShared = (initial: number) => ({ value: initial });

function celebrationArgs(reduceMotion: boolean) {
  return {
    cardScale: makeShared(1) as unknown,
    checkmarkRotate: makeShared(0) as unknown,
    checkmarkScale: makeShared(0) as unknown,
    reduceMotion,
    rippleOpacity: makeShared(0) as unknown,
    rippleScale: makeShared(0) as unknown,
    scheduleFloatingXPHide: jest.fn(),
    setShowConfetti: jest.fn(),
    setShowFloatingXP: jest.fn(),
    setXPPosition: jest.fn(),
  };
}

describe('HabitCard reduced motion — celebration', () => {
  it('skips animation when reduceMotion=true', () => {
    const args = celebrationArgs(true);
    createCelebrationTrigger(args)();
    expect(args.checkmarkScale.value).toBe(1);
    expect(args.rippleScale.value).toBe(0);
    expect(args.setShowConfetti).toHaveBeenCalledWith(false);
    expect(args.setShowFloatingXP).toHaveBeenCalledWith(true);
    expect(args.scheduleFloatingXPHide).toHaveBeenCalled();
  });

  it('plays animation when reduceMotion=false', () => {
    const { withSpring } = require('react-native-reanimated');
    const args = celebrationArgs(false);
    createCelebrationTrigger(args)();
    expect(withSpring).toHaveBeenCalled();
    expect(args.setShowConfetti).toHaveBeenCalledWith(true);
  });

  it('createUncheckTrigger respects reduceMotion', () => {
    const scale = makeShared(1);
    const rotate = makeShared(0);
    createUncheckTrigger(scale as unknown, rotate as unknown, true)();
    expect(scale.value).toBe(1);
    expect(rotate.value).toBe(0);

    const { withTiming } = require('react-native-reanimated');
    withTiming.mockClear();
    createUncheckTrigger(scale as unknown, rotate as unknown, false)();
    expect(withTiming).toHaveBeenCalled();
  });
});

describe('HabitCard reduced motion — panGesture', () => {
  it('accepts reduceMotion and defaults to false', () => {
    const translateX = { value: 0 };
    expect(createPanGesture(translateX as unknown, true)).toBeDefined();
    expect(createPanGesture(translateX as unknown)).toBeDefined();
  });
});
