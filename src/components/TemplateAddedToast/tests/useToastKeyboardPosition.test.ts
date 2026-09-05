import { act, renderHook } from '@testing-library/react-native';
import { Dimensions, Keyboard } from 'react-native';
import type { KeyboardMetrics, ScaledSize } from 'react-native';
import {
  computeKeyboardOverlap,
  computeToastKeyboardClearance,
} from '../toastKeyboardGeometry';
import { useToastKeyboardPosition } from '../useToastKeyboardPosition';

describe('computeKeyboardOverlap', () => {
  it('measures the keyboard obstruction from its screen frame', () => {
    expect(computeKeyboardOverlap(844, 508)).toBe(336);
  });

  it('clamps a keyboard frame below the screen', () => {
    expect(computeKeyboardOverlap(844, 900)).toBe(0);
  });
});

describe('computeToastKeyboardClearance', () => {
  it('lifts an iOS toast by the keyboard height outside the safe area', () => {
    expect(computeToastKeyboardClearance(34, 336, true)).toBe(302);
  });

  it('does not lift when the keyboard is hidden', () => {
    expect(computeToastKeyboardClearance(34, 0, true)).toBe(0);
  });

  it('clamps clearance when the safe area is taller than the keyboard', () => {
    expect(computeToastKeyboardClearance(34, 20, true)).toBe(0);
  });

  it('does not double-lift an Android adjustResize viewport', () => {
    expect(computeToastKeyboardClearance(34, 336, false)).toBe(0);
  });

  it('clamps invalid negative geometry', () => {
    expect(computeToastKeyboardClearance(-10, -20, true)).toBe(0);
  });
});

describe('useToastKeyboardPosition', () => {
  const size = (height: number, width: number): ScaledSize => ({
    fontScale: 1,
    height,
    scale: 3,
    width,
  });
  const metrics = (screenY: number, screenHeight: number): KeyboardMetrics => ({
    height: screenHeight - screenY,
    screenX: 0,
    screenY,
    width: 0,
  });

  let screen: ScaledSize;
  let keyboardMetrics: KeyboardMetrics;
  let dimensionHandlers: Array<
    (dims: { screen: ScaledSize; window: ScaledSize }) => void
  >;

  const readTranslateY = (translateY: unknown): number =>
    (translateY as { value: number }).value;

  beforeEach(() => {
    screen = size(844, 390);
    keyboardMetrics = metrics(508, 844);
    dimensionHandlers = [];
    jest.spyOn(Dimensions, 'get').mockImplementation(() => screen);
    jest
      .spyOn(Dimensions, 'addEventListener')
      .mockImplementation((_type, handler) => {
        dimensionHandlers.push(handler);
        return { remove: jest.fn() } as never;
      });
    jest.spyOn(Keyboard, 'metrics').mockImplementation(() => keyboardMetrics);
    jest.spyOn(Keyboard, 'isVisible').mockReturnValue(true);
    jest
      .spyOn(Keyboard, 'addListener')
      .mockReturnValue({ remove: jest.fn() } as never);
  });

  afterEach(() => jest.restoreAllMocks());

  it('recomputes keyboard clearance from fresh screen height after rotation', () => {
    const { result } = renderHook(() => useToastKeyboardPosition());

    // Portrait: 844pt screen, keyboard top at 508 → 336pt overlap.
    expect(readTranslateY(result.current.translateY)).toBe(-336);

    // Rotate to landscape: 390pt screen, keyboard top at 179 → 211pt overlap.
    act(() => {
      screen = size(390, 844);
      keyboardMetrics = metrics(179, 390);
      for (const handler of dimensionHandlers) {
        handler({ screen, window: screen });
      }
    });

    expect(readTranslateY(result.current.translateY)).toBe(-211);
  });
});
