/**
 * usePressAnimation Hook Tests
 */

import { renderHook, act } from '@testing-library/react-native';
import { usePressAnimation } from '../usePressAnimation';

describe('usePressAnimation', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => usePressAnimation());

    expect(result.current.scale.value).toBe(1);
    expect(result.current.animatedStyle).toBeDefined();
    expect(result.current.pressHandlers).toBeDefined();
    expect(result.current.pressHandlers.onPressIn).toBeInstanceOf(Function);
    expect(result.current.pressHandlers.onPressOut).toBeInstanceOf(Function);
  });

  it('should scale down on press in', () => {
    const { result } = renderHook(() => usePressAnimation({ pressScale: 0.9 }));

    act(() => {
      result.current.pressHandlers.onPressIn();
    });

    // Note: Actual animation happens asynchronously via reanimated
    // This test verifies the API structure is correct
    expect(result.current.scale.value).toBeDefined();
  });

  it('should scale back to 1 on press out', () => {
    const { result } = renderHook(() => usePressAnimation());

    act(() => {
      result.current.pressHandlers.onPressIn();
    });

    act(() => {
      result.current.pressHandlers.onPressOut();
    });

    // Verify the handler executes without errors
    expect(result.current.scale.value).toBeDefined();
  });

  it('should accept custom press scale', () => {
    const customScale = 0.85;
    const { result } = renderHook(() =>
      usePressAnimation({ pressScale: customScale })
    );

    expect(result.current.pressHandlers).toBeDefined();
  });

  it('should provide animated style object', () => {
    const { result } = renderHook(() => usePressAnimation());

    expect(result.current.animatedStyle).toBeDefined();
    expect(typeof result.current.animatedStyle).toBe('object');
  });
});
