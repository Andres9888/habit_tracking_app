/**
 * The just-created highlight, including the Reduce Motion path.
 *
 * Reduce Motion used to blank the glow entirely, which left "go to habit"
 * scrolling to a card with nothing marking it. It now gets a static, held
 * highlight instead — but still no bounce.
 */

import { renderHook } from '@testing-library/react-native';
import * as Reanimated from 'react-native-reanimated';
import { runHighlightGlow } from '../highlightAnimations';
import { useHighlightAnimation } from '../useHighlightAnimation';

jest.mock('../highlightAnimations', () => ({
  runHighlightGlow: jest.fn(),
}));

function makeValues() {
  return { cardScale: { value: 1 }, highlightGlow: { value: 0 } };
}

function makeOptions(
  overrides: Partial<{
    holdHighlight: boolean;
    isJustCreated: boolean;
    reduceMotionPreference: boolean;
  }> = {}
) {
  const { cardScale, highlightGlow } = makeValues();
  return {
    cardScale: cardScale as never,
    highlightGlow: highlightGlow as never,
    holdHighlight: false,
    isJustCreated: true,
    reduceMotionPreference: false,
    ...overrides,
    // Expose the raw values for assertions.
    values: { cardScale, highlightGlow },
  };
}

describe('useHighlightAnimation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());

  it('marks the card statically under Reduce Motion', () => {
    const { values, ...options } = makeOptions({
      reduceMotionPreference: true,
    });

    renderHook(() => useHighlightAnimation(options));

    expect(values.highlightGlow.value).toBe(1);
    // No bounce: the scale is left exactly as it was.
    expect(values.cardScale.value).toBe(1);
    expect(runHighlightGlow).not.toHaveBeenCalled();
  });

  it('fades the Reduce Motion highlight after the hold expires', () => {
    const withTiming = jest.spyOn(Reanimated, 'withTiming');
    const { values, ...options } = makeOptions({
      reduceMotionPreference: true,
    });

    renderHook(() => useHighlightAnimation(options));
    expect(values.highlightGlow.value).toBe(1);

    jest.advanceTimersByTime(1800);
    expect(withTiming).toHaveBeenCalledWith(
      0,
      expect.objectContaining({ duration: 600 })
    );
  });

  it('clears the glow when the habit is not just created', () => {
    const { values, ...options } = makeOptions({
      isJustCreated: false,
      reduceMotionPreference: true,
    });
    values.highlightGlow.value = 1;

    renderHook(() => useHighlightAnimation(options));

    expect(values.highlightGlow.value).toBe(0);
  });

  it('glows immediately without a card bounce when motion is allowed', () => {
    const { values, ...options } = makeOptions();

    renderHook(() => useHighlightAnimation(options));

    // No bounce: scale transforms blur the card's SVG icon on this codebase.
    expect(values.cardScale.value).toBe(1);
    // The glow was kicked off immediately, no timer advance needed.
    expect(runHighlightGlow).toHaveBeenCalledWith(options.highlightGlow);
  });

  it('resets a stranded press scale before the visible glow', () => {
    const { values, ...options } = makeOptions();
    values.cardScale.value = 0.97;

    renderHook(() => useHighlightAnimation(options));

    expect(values.cardScale.value).toBe(1);
  });

  it('holds a prepared focus ring without starting its visible fade', () => {
    const { values, ...options } = makeOptions({ holdHighlight: true });

    renderHook(() => useHighlightAnimation(options));

    expect(values.highlightGlow.value).toBe(1);
    expect(runHighlightGlow).not.toHaveBeenCalled();
  });
});
