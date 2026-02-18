/**
 * Debounced Inputs Utility Tests
 * Tests for debounce utilities for search/filter inputs
 */

import { renderHook, act, waitFor } from '@testing-library/react-native';
import { useCreateDebouncedSetter, DebouncedInputs } from '../debouncedInputs';

describe('debouncedInputs', () => {
  describe('useCreateDebouncedSetter', () => {
    it('creates a debounced setter function', () => {
      const mockSetter = jest.fn();
      const { result } = renderHook(() =>
        useCreateDebouncedSetter(mockSetter, 100)
      );

      expect(typeof result.current).toBe('function');
    });

    it('debounces setter calls with default 300ms delay', async () => {
      const mockSetter = jest.fn();
      const { result } = renderHook(() => useCreateDebouncedSetter(mockSetter));

      act(() => {
        result.current('test1');
        result.current('test2');
        result.current('test3');
      });

      // Setter should not be called immediately
      expect(mockSetter).not.toHaveBeenCalled();

      // Wait for debounce
      await waitFor(
        () => {
          expect(mockSetter).toHaveBeenCalled();
        },
        { timeout: 400 }
      );

      // Setter should only be called once with the latest value
      expect(mockSetter).toHaveBeenCalledTimes(1);
      expect(mockSetter).toHaveBeenCalledWith('test3');
    });

    it('respects custom delay parameter', async () => {
      const mockSetter = jest.fn();
      const customDelay = 50;
      const { result } = renderHook(() =>
        useCreateDebouncedSetter(mockSetter, customDelay)
      );

      act(() => {
        result.current('value');
      });

      expect(mockSetter).not.toHaveBeenCalled();

      await waitFor(
        () => {
          expect(mockSetter).toHaveBeenCalled();
        },
        { timeout: customDelay + 50 }
      );

      expect(mockSetter).toHaveBeenCalledWith('value');
    });

    it('clears timeout on subsequent calls', async () => {
      const mockSetter = jest.fn();
      const { result } = renderHook(() =>
        useCreateDebouncedSetter(mockSetter, 100)
      );

      act(() => {
        result.current('value1');
      });

      // Call again before debounce completes
      await act(async () => {
        await new Promise((resolve) => setTimeout(resolve, 50));
        result.current('value2');
      });

      await waitFor(
        () => {
          expect(mockSetter).toHaveBeenCalled();
        },
        { timeout: 150 }
      );

      // Should only call setter once with the final value
      expect(mockSetter).toHaveBeenCalledTimes(1);
      expect(mockSetter).toHaveBeenCalledWith('value2');
    });

    it('accepts generic type parameter', () => {
      interface CustomType {
        id: number;
        name: string;
      }

      const mockSetter = jest.fn<void, [CustomType]>();
      const { result } = renderHook(() =>
        useCreateDebouncedSetter<CustomType>(mockSetter, 100)
      );

      expect(typeof result.current).toBe('function');
    });

    it('handles multiple independent debounced setters', async () => {
      const setter1 = jest.fn();
      const setter2 = jest.fn();

      const { result: result1 } = renderHook(() =>
        useCreateDebouncedSetter(setter1, 100)
      );
      const { result: result2 } = renderHook(() =>
        useCreateDebouncedSetter(setter2, 100)
      );

      act(() => {
        result1.current('value1');
        result2.current('value2');
      });

      await waitFor(
        () => {
          expect(setter1).toHaveBeenCalled();
          expect(setter2).toHaveBeenCalled();
        },
        { timeout: 150 }
      );

      expect(setter1).toHaveBeenCalledWith('value1');
      expect(setter2).toHaveBeenCalledWith('value2');
    });
  });

  describe('DebouncedInputs.textInput', () => {
    it('returns a debounced setter for text', async () => {
      const mockSetter = jest.fn();
      const { result } = renderHook(() =>
        DebouncedInputs.textInput(mockSetter)
      );

      expect(typeof result.current).toBe('function');

      act(() => {
        result.current('search text');
        result.current('search text 2');
      });

      await waitFor(
        () => {
          expect(mockSetter).toHaveBeenCalled();
        },
        { timeout: 400 }
      );

      expect(mockSetter).toHaveBeenCalledWith('search text 2');
    });

    it('debounces rapid text input', async () => {
      const mockSetter = jest.fn();
      const { result } = renderHook(() =>
        DebouncedInputs.textInput(mockSetter)
      );

      act(() => {
        'hello world'.split('').forEach((char, i) => {
          result.current(char);
        });
      });

      await waitFor(
        () => {
          expect(mockSetter).toHaveBeenCalled();
        },
        { timeout: 400 }
      );

      // Should only call once or minimal times for all characters
      expect(mockSetter.mock.calls.length).toBeLessThanOrEqual(2);
    });
  });

  describe('DebouncedInputs.selectInput', () => {
    it('returns a debounced setter for select values', async () => {
      const mockSetter = jest.fn<void, [string]>();
      const { result } = renderHook(() =>
        DebouncedInputs.selectInput<string>(mockSetter)
      );

      expect(typeof result.current).toBe('function');

      act(() => {
        result.current('option1');
        result.current('option2');
      });

      await waitFor(
        () => {
          expect(mockSetter).toHaveBeenCalled();
        },
        { timeout: 400 }
      );

      expect(mockSetter).toHaveBeenCalledWith('option2');
    });
  });

  describe('DebouncedInputs.toggleInput', () => {
    it('returns a debounced setter for boolean values', async () => {
      const mockSetter = jest.fn();
      const { result } = renderHook(() =>
        DebouncedInputs.toggleInput(mockSetter)
      );

      expect(typeof result.current).toBe('function');

      act(() => {
        result.current(true);
        result.current(false);
        result.current(true);
      });

      await waitFor(
        () => {
          expect(mockSetter).toHaveBeenCalled();
        },
        { timeout: 400 }
      );

      expect(mockSetter).toHaveBeenCalledWith(true);
    });

    it('handles toggle on/off correctly', async () => {
      const mockSetter = jest.fn();
      const { result } = renderHook(() =>
        DebouncedInputs.toggleInput(mockSetter)
      );

      act(() => {
        result.current(false);
      });

      await waitFor(
        () => {
          expect(mockSetter).toHaveBeenCalledWith(false);
        },
        { timeout: 400 }
      );
    });
  });

  describe('DebouncedInputs.numberInput', () => {
    it('returns a debounced setter for numeric values', async () => {
      const mockSetter = jest.fn();
      const { result } = renderHook(() =>
        DebouncedInputs.numberInput(mockSetter)
      );

      expect(typeof result.current).toBe('function');

      act(() => {
        result.current(10);
        result.current(20);
        result.current(30);
      });

      await waitFor(
        () => {
          expect(mockSetter).toHaveBeenCalled();
        },
        { timeout: 400 }
      );

      expect(mockSetter).toHaveBeenCalledWith(30);
    });

    it('handles negative numbers', async () => {
      const mockSetter = jest.fn();
      const { result } = renderHook(() =>
        DebouncedInputs.numberInput(mockSetter)
      );

      act(() => {
        result.current(-5);
        result.current(-10);
      });

      await waitFor(
        () => {
          expect(mockSetter).toHaveBeenCalled();
        },
        { timeout: 400 }
      );

      expect(mockSetter).toHaveBeenCalledWith(-10);
    });

    it('handles decimal numbers', async () => {
      const mockSetter = jest.fn();
      const { result } = renderHook(() =>
        DebouncedInputs.numberInput(mockSetter)
      );

      act(() => {
        result.current(3.14);
        result.current(2.71);
      });

      await waitFor(
        () => {
          expect(mockSetter).toHaveBeenCalled();
        },
        { timeout: 400 }
      );

      expect(mockSetter).toHaveBeenCalledWith(2.71);
    });
  });

  describe('DebouncedInputs debounce consistency', () => {
    it('all input types use consistent debounce delay', async () => {
      const textSetter = jest.fn();
      const selectSetter = jest.fn();
      const toggleSetter = jest.fn();
      const numberSetter = jest.fn();

      const { result: textResult } = renderHook(() =>
        DebouncedInputs.textInput(textSetter)
      );
      const { result: selectResult } = renderHook(() =>
        DebouncedInputs.selectInput<string>(selectSetter)
      );
      const { result: toggleResult } = renderHook(() =>
        DebouncedInputs.toggleInput(toggleSetter)
      );
      const { result: numberResult } = renderHook(() =>
        DebouncedInputs.numberInput(numberSetter)
      );

      const startTime = Date.now();

      act(() => {
        textResult.current('text');
        selectResult.current('select');
        toggleResult.current(true);
        numberResult.current(42);
      });

      await waitFor(
        () => {
          expect(textSetter).toHaveBeenCalled();
          expect(selectSetter).toHaveBeenCalled();
          expect(toggleSetter).toHaveBeenCalled();
          expect(numberSetter).toHaveBeenCalled();
        },
        { timeout: 400 }
      );

      const endTime = Date.now();
      const elapsed = endTime - startTime;

      // All should resolve around the same time (within margin)
      expect(elapsed).toBeGreaterThan(250);
    });
  });
});
