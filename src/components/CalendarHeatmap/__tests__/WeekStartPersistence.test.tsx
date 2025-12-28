/**
 * Week Start Persistence Integration Tests
 * Progress Section Specification - Phase 8.3: Week Start Customization
 *
 * Tests:
 * - WeekStartProvider persistence to AsyncStorage
 * - Loading saved week start day on mount
 * - Saving week start day on change
 * - isWeekStartReady loading state
 * - persistSelection prop behavior
 */

import React from 'react';
import { render, waitFor, act } from '@testing-library/react-native';
import { Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  WeekStartProvider,
  useWeekStart,
  useWeekStartOptional,
} from '../WeekStartContext';
import type { WeekStartDay } from '../types';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
}));

const STORAGE_KEY = '@habit_app:week_start_day';

describe('WeekStart Persistence Integration Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
    (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);
  });

  describe('WeekStartProvider Persistence', () => {
    it('loads saved week start day from AsyncStorage on mount', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('1'); // Monday

      let capturedDay: WeekStartDay | undefined;

      function WeekStartConsumer() {
        const { weekStartDay } = useWeekStart();
        capturedDay = weekStartDay;
        return <Text testID='day'>{weekStartDay}</Text>;
      }

      render(
        <WeekStartProvider persistSelection={true}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      await waitFor(() => {
        expect(capturedDay).toBe(1);
      });

      expect(AsyncStorage.getItem).toHaveBeenCalledWith(STORAGE_KEY);
    });

    it('falls back to initialWeekStart when no saved day exists', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

      let capturedDay: WeekStartDay | undefined;

      function WeekStartConsumer() {
        const { weekStartDay } = useWeekStart();
        capturedDay = weekStartDay;
        return <Text testID='day'>{weekStartDay}</Text>;
      }

      render(
        <WeekStartProvider initialWeekStart={1} persistSelection={true}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      await waitFor(() => {
        expect(capturedDay).toBe(1);
      });
    });

    it('saves week start day to AsyncStorage when setWeekStartDay is called', async () => {
      let setWeekStartFn: ((day: WeekStartDay) => void) | undefined;

      function WeekStartConsumer() {
        const { setWeekStartDay, weekStartDay } = useWeekStart();
        setWeekStartFn = setWeekStartDay;
        return <Text testID='day'>{weekStartDay}</Text>;
      }

      render(
        <WeekStartProvider persistSelection={true}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      // Wait for initialization
      await waitFor(() => {
        expect(setWeekStartFn).toBeDefined();
      });

      // Switch week start day
      act(() => {
        if (setWeekStartFn) {
          setWeekStartFn(1); // Monday
        }
      });

      await waitFor(() => {
        expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, '1');
      });
    });

    it('does not persist when persistSelection is false', async () => {
      let setWeekStartFn: ((day: WeekStartDay) => void) | undefined;

      function WeekStartConsumer() {
        const { setWeekStartDay, weekStartDay } = useWeekStart();
        setWeekStartFn = setWeekStartDay;
        return <Text testID='day'>{weekStartDay}</Text>;
      }

      render(
        <WeekStartProvider persistSelection={false}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      // Wait for initialization
      await waitFor(() => {
        expect(setWeekStartFn).toBeDefined();
      });

      // Switch week start day
      act(() => {
        if (setWeekStartFn) {
          setWeekStartFn(1);
        }
      });

      expect(AsyncStorage.setItem).not.toHaveBeenCalled();
      expect(AsyncStorage.getItem).not.toHaveBeenCalled();
    });

    it('does not load from AsyncStorage when persistSelection is false', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('5'); // Friday

      let capturedDay: WeekStartDay | undefined;

      function WeekStartConsumer() {
        const { weekStartDay } = useWeekStart();
        capturedDay = weekStartDay;
        return <Text testID='day'>{weekStartDay}</Text>;
      }

      render(
        <WeekStartProvider initialWeekStart={0} persistSelection={false}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      // Should use initialWeekStart, not saved day
      expect(capturedDay).toBe(0);
      expect(AsyncStorage.getItem).not.toHaveBeenCalled();
    });

    it('provides isWeekStartReady=true immediately when persistence is disabled', () => {
      let isReady: boolean | undefined;

      function WeekStartConsumer() {
        const { isWeekStartReady } = useWeekStart();
        isReady = isWeekStartReady;
        return (
          <Text testID='ready'>{isWeekStartReady ? 'ready' : 'loading'}</Text>
        );
      }

      render(
        <WeekStartProvider persistSelection={false}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      expect(isReady).toBe(true);
    });

    it('provides isWeekStartReady=false initially when persistence is enabled', () => {
      // Use a delayed promise to simulate async load
      (AsyncStorage.getItem as jest.Mock).mockImplementation(
        () => new Promise(() => {}) // Never resolves during this test
      );

      let isReady: boolean | undefined;

      function WeekStartConsumer() {
        const { isWeekStartReady } = useWeekStart();
        isReady = isWeekStartReady;
        return (
          <Text testID='ready'>{isWeekStartReady ? 'ready' : 'loading'}</Text>
        );
      }

      render(
        <WeekStartProvider persistSelection={true}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      expect(isReady).toBe(false);
    });

    it('provides isWeekStartReady=true after loading completes', async () => {
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('3'); // Wednesday

      let isReady: boolean | undefined;

      function WeekStartConsumer() {
        const { isWeekStartReady } = useWeekStart();
        isReady = isWeekStartReady;
        return (
          <Text testID='ready'>{isWeekStartReady ? 'ready' : 'loading'}</Text>
        );
      }

      render(
        <WeekStartProvider persistSelection={true}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      await waitFor(() => {
        expect(isReady).toBe(true);
      });
    });

    it('saves each valid week start day correctly', async () => {
      const days: WeekStartDay[] = [0, 1, 2, 3, 4, 5, 6];

      for (const day of days) {
        jest.clearAllMocks();
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        (AsyncStorage.setItem as jest.Mock).mockResolvedValue(undefined);

        let setWeekStartFn: ((d: WeekStartDay) => void) | undefined;

        function WeekStartConsumer() {
          const { setWeekStartDay } = useWeekStart();
          setWeekStartFn = setWeekStartDay;
          return null;
        }

        const { unmount } = render(
          <WeekStartProvider persistSelection={true}>
            <WeekStartConsumer />
          </WeekStartProvider>
        );

        await waitFor(() => {
          expect(setWeekStartFn).toBeDefined();
        });

        act(() => {
          if (setWeekStartFn) {
            setWeekStartFn(day);
          }
        });

        await waitFor(() => {
          expect(AsyncStorage.setItem).toHaveBeenCalledWith(
            STORAGE_KEY,
            String(day)
          );
        });

        unmount();
      }
    });

    it('loads each valid week start day correctly', async () => {
      const days: WeekStartDay[] = [0, 1, 2, 3, 4, 5, 6];

      for (const day of days) {
        jest.clearAllMocks();
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(String(day));

        let capturedDay: WeekStartDay | undefined;

        function WeekStartConsumer() {
          const { weekStartDay } = useWeekStart();
          capturedDay = weekStartDay;
          return null;
        }

        const { unmount } = render(
          <WeekStartProvider persistSelection={true}>
            <WeekStartConsumer />
          </WeekStartProvider>
        );

        await waitFor(() => {
          expect(capturedDay).toBe(day);
        });

        unmount();
      }
    });
  });

  describe('useWeekStart Hook', () => {
    it('throws error when used outside WeekStartProvider', () => {
      // Suppress console.error for expected error
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

      function BadComponent() {
        useWeekStart();
        return null;
      }

      expect(() => render(<BadComponent />)).toThrow(
        'useWeekStart must be used within a WeekStartProvider'
      );

      consoleSpy.mockRestore();
    });

    it('returns context value inside WeekStartProvider', () => {
      let contextValue: ReturnType<typeof useWeekStart> | undefined;

      function WeekStartConsumer() {
        contextValue = useWeekStart();
        return null;
      }

      render(
        <WeekStartProvider persistSelection={false}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      expect(contextValue).toBeDefined();
      expect(contextValue?.weekStartDay).toBe(0);
      expect(contextValue?.weekStartDayName).toBe('sunday');
      expect(contextValue?.setWeekStartDay).toBeDefined();
      expect(contextValue?.availableOptions).toEqual([0, 1, 2, 3, 4, 5, 6]);
    });
  });

  describe('useWeekStartOptional Hook', () => {
    it('returns undefined when used outside WeekStartProvider', () => {
      let contextValue: ReturnType<typeof useWeekStartOptional> | undefined;

      function OptionalConsumer() {
        contextValue = useWeekStartOptional();
        return null;
      }

      render(<OptionalConsumer />);

      expect(contextValue).toBeUndefined();
    });

    it('returns context value inside WeekStartProvider', () => {
      let contextValue: ReturnType<typeof useWeekStartOptional> | undefined;

      function OptionalConsumer() {
        contextValue = useWeekStartOptional();
        return null;
      }

      render(
        <WeekStartProvider initialWeekStart={1} persistSelection={false}>
          <OptionalConsumer />
        </WeekStartProvider>
      );

      expect(contextValue).toBeDefined();
      expect(contextValue?.weekStartDay).toBe(1);
      expect(contextValue?.weekStartDayName).toBe('monday');
    });
  });

  describe('weekStartDayName Synchronization', () => {
    it('updates weekStartDayName when weekStartDay changes', async () => {
      let setWeekStartFn: ((day: WeekStartDay) => void) | undefined;
      let capturedDayName: string | undefined;

      function WeekStartConsumer() {
        const { setWeekStartDay, weekStartDayName } = useWeekStart();
        setWeekStartFn = setWeekStartDay;
        capturedDayName = weekStartDayName;
        return <Text testID='name'>{weekStartDayName}</Text>;
      }

      render(
        <WeekStartProvider initialWeekStart={0} persistSelection={false}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      expect(capturedDayName).toBe('sunday');

      act(() => {
        if (setWeekStartFn) {
          setWeekStartFn(1);
        }
      });

      expect(capturedDayName).toBe('monday');

      act(() => {
        if (setWeekStartFn) {
          setWeekStartFn(6);
        }
      });

      expect(capturedDayName).toBe('saturday');
    });
  });

  describe('Edge Cases', () => {
    it('handles AsyncStorage.getItem error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      let capturedDay: WeekStartDay | undefined;
      let isReady: boolean | undefined;

      function WeekStartConsumer() {
        const { weekStartDay, isWeekStartReady } = useWeekStart();
        capturedDay = weekStartDay;
        isReady = isWeekStartReady;
        return null;
      }

      render(
        <WeekStartProvider initialWeekStart={2} persistSelection={true}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      await waitFor(() => {
        expect(isReady).toBe(true);
      });

      // Should fall back to initialWeekStart
      expect(capturedDay).toBe(2);

      consoleSpy.mockRestore();
    });

    it('handles AsyncStorage.setItem error gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
      (AsyncStorage.setItem as jest.Mock).mockRejectedValue(
        new Error('Storage error')
      );

      let setWeekStartFn: ((day: WeekStartDay) => void) | undefined;
      let capturedDay: WeekStartDay | undefined;

      function WeekStartConsumer() {
        const { setWeekStartDay, weekStartDay } = useWeekStart();
        setWeekStartFn = setWeekStartDay;
        capturedDay = weekStartDay;
        return null;
      }

      render(
        <WeekStartProvider persistSelection={true}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      await waitFor(() => {
        expect(setWeekStartFn).toBeDefined();
      });

      // Should still update state even if save fails
      act(() => {
        if (setWeekStartFn) {
          setWeekStartFn(3);
        }
      });

      expect(capturedDay).toBe(3);

      consoleSpy.mockRestore();
    });

    it('handles invalid stored value gracefully', async () => {
      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      (AsyncStorage.getItem as jest.Mock).mockResolvedValue('invalid');

      let capturedDay: WeekStartDay | undefined;

      function WeekStartConsumer() {
        const { weekStartDay } = useWeekStart();
        capturedDay = weekStartDay;
        return null;
      }

      render(
        <WeekStartProvider initialWeekStart={4} persistSelection={true}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      await waitFor(() => {
        // Should fall back to initialWeekStart when stored value is invalid
        expect(capturedDay).toBe(4);
      });

      consoleSpy.mockRestore();
    });

    it('uses DEFAULT_WEEK_START (0) when no initialWeekStart provided', () => {
      let capturedDay: WeekStartDay | undefined;

      function WeekStartConsumer() {
        const { weekStartDay } = useWeekStart();
        capturedDay = weekStartDay;
        return null;
      }

      render(
        <WeekStartProvider persistSelection={false}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      expect(capturedDay).toBe(0); // DEFAULT_WEEK_START
    });

    it('provides all 7 days in availableOptions', () => {
      let options: WeekStartDay[] | undefined;

      function WeekStartConsumer() {
        const { availableOptions } = useWeekStart();
        options = availableOptions;
        return null;
      }

      render(
        <WeekStartProvider persistSelection={false}>
          <WeekStartConsumer />
        </WeekStartProvider>
      );

      expect(options).toEqual([0, 1, 2, 3, 4, 5, 6]);
      expect(options).toHaveLength(7);
    });
  });
});
