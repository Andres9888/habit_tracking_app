/**
 * highlightAnimations Tests
 *
 * Verifies runIconPulseLoop returns a stoppable CompositeAnimation
 * and runHighlightAnimation starts without errors.
 */

import { Animated } from 'react-native';
import {
  runIconPulseLoop,
  runHighlightAnimation,
} from '../highlightAnimations';

const loopSpy = jest.spyOn(Animated, 'loop');

describe('runIconPulseLoop', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return a CompositeAnimation with start and stop methods', () => {
    const iconPulse = new Animated.Value(1);
    const result = runIconPulseLoop(iconPulse);

    expect(result).toBeDefined();
    expect(typeof result.stop).toBe('function');
  });

  it('should call Animated.loop once', () => {
    const iconPulse = new Animated.Value(1);
    runIconPulseLoop(iconPulse);

    expect(loopSpy).toHaveBeenCalledTimes(1);
  });

  it('should be stoppable without throwing', () => {
    const iconPulse = new Animated.Value(1);
    const loop = runIconPulseLoop(iconPulse);

    expect(() => loop.stop()).not.toThrow();
  });
});

describe('runHighlightAnimation', () => {
  it('should start without errors', () => {
    const cardScale = new Animated.Value(1);
    const highlightGlow = new Animated.Value(0);

    expect(() =>
      runHighlightAnimation(cardScale, highlightGlow)
    ).not.toThrow();
  });
});
