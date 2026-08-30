/**
 * The just-created highlight, including the Reduce Motion path.
 *
 * Reduce Motion used to blank the glow entirely, which left "go to habit"
 * scrolling to a card with nothing marking it. It now gets a static, held
 * highlight instead — but still no bounce.
 */

import { renderHook } from '@testing-library/react-native';
import { runHighlightGlow } from '../highlightAnimations';
import { useHighlightAnimation } from '../useHighlightAnimation';

jest.mock('../highlightAnimations', () => ({
  runHighlightGlow: jest.fn(),
}));

function makeValues() {
  return { cardScale: { value: 1 }, highlightGlow: { value: 0 } };
}

describe('useHighlightAnimation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });
  afterEach(() => jest.useRealTimers());

  it('marks the card statically under Reduce Motion', () => {
    const { cardScale, highlightGlow } = makeValues();

    renderHook(() =>
      useHighlightAnimation(
        true,
        false,
        true,
        cardScale as never,
        highlightGlow as never
      )
    );

    expect(highlightGlow.value).toBe(1);
    // No bounce: the scale is left exactly as it was.
    expect(cardScale.value).toBe(1);
  });

  it('clears the glow when the habit is not just created', () => {
    const { cardScale, highlightGlow } = makeValues();
    highlightGlow.value = 1;

    renderHook(() =>
      useHighlightAnimation(
        false,
        false,
        true,
        cardScale as never,
        highlightGlow as never
      )
    );

    expect(highlightGlow.value).toBe(0);
  });

  it('glows immediately without a card bounce when motion is allowed', () => {
    const { cardScale, highlightGlow } = makeValues();

    renderHook(() =>
      useHighlightAnimation(
        true,
        false,
        false,
        cardScale as never,
        highlightGlow as never
      )
    );

    // No bounce: scale transforms blur the card's SVG icon on this codebase.
    expect(cardScale.value).toBe(1);
    // The glow was kicked off immediately, no timer advance needed.
    expect(runHighlightGlow).toHaveBeenCalledWith(highlightGlow);
  });

  it('holds a prepared focus ring without starting its visible fade', () => {
    const { cardScale, highlightGlow } = makeValues();

    renderHook(() =>
      useHighlightAnimation(
        true,
        true,
        false,
        cardScale as never,
        highlightGlow as never
      )
    );

    expect(highlightGlow.value).toBe(1);
    expect(runHighlightGlow).not.toHaveBeenCalled();
  });
});
