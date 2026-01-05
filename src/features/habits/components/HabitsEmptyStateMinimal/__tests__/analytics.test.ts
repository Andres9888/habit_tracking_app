/**
 * Tests for Time-Based Chip Analytics
 *
 * Verifies analytics tracking functionality for time-based suggestion chips.
 */

import { renderHook } from '@testing-library/react-native';

import {
  getChipLabels,
  getTimeWindowFromHour,
  setTimeBasedChipAnalyticsTracker,
  trackTimeBasedChipEvent,
  useTimeBasedChipAnalytics,
  type TimeBasedChipAnalyticsTracker,
  type TimeBasedChipEvent,
} from '../analytics';
import type { SuggestionChip } from '../types';

describe('Time-Based Chip Analytics', () => {
  describe('getTimeWindowFromHour', () => {
    it('returns morning for hours 5-10', () => {
      expect(getTimeWindowFromHour(5)).toBe('morning');
      expect(getTimeWindowFromHour(8)).toBe('morning');
      expect(getTimeWindowFromHour(10)).toBe('morning');
    });

    it('returns afternoon for hours 11-16', () => {
      expect(getTimeWindowFromHour(11)).toBe('afternoon');
      expect(getTimeWindowFromHour(14)).toBe('afternoon');
      expect(getTimeWindowFromHour(16)).toBe('afternoon');
    });

    it('returns evening for hours 17-21', () => {
      expect(getTimeWindowFromHour(17)).toBe('evening');
      expect(getTimeWindowFromHour(19)).toBe('evening');
      expect(getTimeWindowFromHour(21)).toBe('evening');
    });

    it('returns night for hours 22-4', () => {
      expect(getTimeWindowFromHour(22)).toBe('night');
      expect(getTimeWindowFromHour(23)).toBe('night');
      expect(getTimeWindowFromHour(0)).toBe('night');
      expect(getTimeWindowFromHour(2)).toBe('night');
      expect(getTimeWindowFromHour(4)).toBe('night');
    });
  });

  describe('getChipLabels', () => {
    it('extracts labels from chip array', () => {
      const chips: SuggestionChip[] = [
        { emoji: '☕', fullName: 'Morning coffee', label: 'Coffee' },
        { emoji: '🏃', fullName: 'Morning run', label: 'Run' },
        { emoji: '🧘', fullName: 'Morning meditation', label: 'Meditate' },
      ];

      expect(getChipLabels(chips)).toEqual(['Coffee', 'Run', 'Meditate']);
    });

    it('returns empty array for empty input', () => {
      expect(getChipLabels([])).toEqual([]);
    });
  });

  describe('trackTimeBasedChipEvent', () => {
    let mockTracker: TimeBasedChipAnalyticsTracker;
    let trackSpy: jest.Mock;

    beforeEach(() => {
      trackSpy = jest.fn();
      mockTracker = { track: trackSpy };
      setTimeBasedChipAnalyticsTracker(mockTracker);
    });

    it('tracks chips_displayed event', () => {
      const event: TimeBasedChipEvent = {
        type: 'chips_displayed',
        timeWindow: 'morning',
        hour: 8,
        chipLabels: ['Coffee', 'Run', 'Meditate'],
        timestamp: Date.now(),
      };

      trackTimeBasedChipEvent(event);

      expect(trackSpy).toHaveBeenCalledWith(event);
    });

    it('tracks chip_selected event', () => {
      const event: TimeBasedChipEvent = {
        type: 'chip_selected',
        timeWindow: 'afternoon',
        chipLabel: 'Water',
        chipFullName: 'Drink water',
        chipEmoji: '💧',
        chipIndex: 0,
        hour: 14,
        timestamp: Date.now(),
      };

      trackTimeBasedChipEvent(event);

      expect(trackSpy).toHaveBeenCalledWith(event);
    });

    it('tracks chip_converted_to_habit event', () => {
      const event: TimeBasedChipEvent = {
        type: 'chip_converted_to_habit',
        timeWindow: 'evening',
        chipLabel: 'Read',
        chipFullName: 'Read 10 pages',
        chipEmoji: '📚',
        chipIndex: 0,
        timeToConversion: 5000,
        timestamp: Date.now(),
      };

      trackTimeBasedChipEvent(event);

      expect(trackSpy).toHaveBeenCalledWith(event);
    });

    it('handles tracker errors gracefully', () => {
      const errorTracker: TimeBasedChipAnalyticsTracker = {
        track: () => {
          throw new Error('Tracker error');
        },
      };
      setTimeBasedChipAnalyticsTracker(errorTracker);

      const event: TimeBasedChipEvent = {
        type: 'chips_displayed',
        timeWindow: 'morning',
        hour: 8,
        chipLabels: ['Coffee'],
        timestamp: Date.now(),
      };

      // Should not throw
      expect(() => trackTimeBasedChipEvent(event)).not.toThrow();
    });
  });

  describe('useTimeBasedChipAnalytics', () => {
    let mockTracker: TimeBasedChipAnalyticsTracker;
    let trackSpy: jest.Mock;

    beforeEach(() => {
      trackSpy = jest.fn();
      mockTracker = { track: trackSpy };
      setTimeBasedChipAnalyticsTracker(mockTracker);
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-01-05T08:30:00')); // 8:30am = morning
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('provides trackChipsDisplayed function', () => {
      const { result } = renderHook(() => useTimeBasedChipAnalytics());

      const chips: SuggestionChip[] = [
        { emoji: '☕', fullName: 'Morning coffee', label: 'Coffee' },
        { emoji: '🏃', fullName: 'Morning run', label: 'Run' },
      ];

      result.current.trackChipsDisplayed(chips);

      // Should track chips_displayed
      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'chips_displayed',
          timeWindow: 'morning',
          hour: 8,
          chipLabels: ['Coffee', 'Run'],
        })
      );

      // Should also track time_window_distribution
      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'time_window_distribution',
          timeWindow: 'morning',
          hour: 8,
        })
      );
    });

    it('provides trackChipSelected function', () => {
      const { result } = renderHook(() => useTimeBasedChipAnalytics());

      const chip: SuggestionChip = {
        emoji: '☕',
        fullName: 'Morning coffee',
        label: 'Coffee',
      };

      result.current.trackChipSelected(chip, 0);

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'chip_selected',
          timeWindow: 'morning',
          chipLabel: 'Coffee',
          chipFullName: 'Morning coffee',
          chipEmoji: '☕',
          chipIndex: 0,
          hour: 8,
        })
      );
    });

    it('provides trackChipDeselected function', () => {
      const { result } = renderHook(() => useTimeBasedChipAnalytics());

      const chip: SuggestionChip = {
        emoji: '☕',
        fullName: 'Morning coffee',
        label: 'Coffee',
      };

      result.current.trackChipDeselected(chip, 0);

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'chip_deselected',
          timeWindow: 'morning',
          chipLabel: 'Coffee',
          chipIndex: 0,
          previouslySelected: true,
        })
      );
    });

    it('provides trackChipConvertedToHabit function with time calculation', () => {
      const { result } = renderHook(() => useTimeBasedChipAnalytics());

      const chip: SuggestionChip = {
        emoji: '☕',
        fullName: 'Morning coffee',
        label: 'Coffee',
      };

      const displayTimestamp = Date.now() - 5000; // 5 seconds ago

      result.current.trackChipConvertedToHabit(chip, 0, displayTimestamp);

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'chip_converted_to_habit',
          timeWindow: 'morning',
          chipLabel: 'Coffee',
          chipFullName: 'Morning coffee',
          chipEmoji: '☕',
          chipIndex: 0,
          timeToConversion: 5000,
        })
      );
    });

    it('provides trackManualInputAfterChipView function', () => {
      const { result } = renderHook(() => useTimeBasedChipAnalytics());

      const chips: SuggestionChip[] = [
        { emoji: '☕', fullName: 'Morning coffee', label: 'Coffee' },
        { emoji: '🏃', fullName: 'Morning run', label: 'Run' },
      ];

      result.current.trackManualInputAfterChipView('Custom habit', chips);

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'manual_input_after_chip_view',
          timeWindow: 'morning',
          manualHabitName: 'Custom habit',
          chipsViewed: ['Coffee', 'Run'],
        })
      );
    });

    it('tracks correct time window for afternoon', () => {
      jest.setSystemTime(new Date('2026-01-05T14:30:00')); // 2:30pm = afternoon

      const { result } = renderHook(() => useTimeBasedChipAnalytics());

      const chip: SuggestionChip = {
        emoji: '💧',
        fullName: 'Drink water',
        label: 'Water',
      };

      result.current.trackChipSelected(chip, 0);

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'chip_selected',
          timeWindow: 'afternoon',
          hour: 14,
        })
      );
    });

    it('tracks correct time window for evening', () => {
      jest.setSystemTime(new Date('2026-01-05T19:30:00')); // 7:30pm = evening

      const { result } = renderHook(() => useTimeBasedChipAnalytics());

      const chip: SuggestionChip = {
        emoji: '📚',
        fullName: 'Read 10 pages',
        label: 'Read',
      };

      result.current.trackChipSelected(chip, 0);

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'chip_selected',
          timeWindow: 'evening',
          hour: 19,
        })
      );
    });

    it('tracks correct time window for night', () => {
      jest.setSystemTime(new Date('2026-01-05T23:30:00')); // 11:30pm = night

      const { result } = renderHook(() => useTimeBasedChipAnalytics());

      const chip: SuggestionChip = {
        emoji: '🌙',
        fullName: 'Sleep routine',
        label: 'Sleep prep',
      };

      result.current.trackChipSelected(chip, 0);

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'chip_selected',
          timeWindow: 'night',
          hour: 23,
        })
      );
    });
  });

  describe('setTimeBasedChipAnalyticsTracker', () => {
    it('allows setting custom tracker', () => {
      const customTrackSpy = jest.fn();
      const customTracker: TimeBasedChipAnalyticsTracker = {
        track: customTrackSpy,
      };

      setTimeBasedChipAnalyticsTracker(customTracker);

      const event: TimeBasedChipEvent = {
        type: 'chips_displayed',
        timeWindow: 'morning',
        hour: 8,
        chipLabels: ['Coffee'],
        timestamp: Date.now(),
      };

      trackTimeBasedChipEvent(event);

      expect(customTrackSpy).toHaveBeenCalledWith(event);
    });
  });

  describe('Autocomplete Analytics', () => {
    let mockTracker: jest.Mocked<import('../analytics').AutocompleteAnalyticsTracker>;
    let trackSpy: jest.Mock;

    beforeEach(() => {
      trackSpy = jest.fn();
      mockTracker = { track: trackSpy };
      import('../analytics').then((module) => {
        module.setAutocompleteAnalyticsTracker(mockTracker);
      });
    });

    it('tracks autocomplete_suggestion_shown event', async () => {
      const { setAutocompleteAnalyticsTracker, trackAutocompleteEvent } =
        await import('../analytics');

      setAutocompleteAnalyticsTracker(mockTracker);

      trackAutocompleteEvent({
        type: 'autocomplete_suggestion_shown',
        userInput: 'exe',
        suggestion: 'Exercise 10 minutes',
        inputLength: 3,
        matchType: 'prefix',
        timestamp: Date.now(),
      });

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'autocomplete_suggestion_shown',
          userInput: 'exe',
          suggestion: 'Exercise 10 minutes',
          matchType: 'prefix',
        })
      );
    });

    it('tracks autocomplete_suggestion_accepted event', async () => {
      const { setAutocompleteAnalyticsTracker, trackAutocompleteEvent } =
        await import('../analytics');

      setAutocompleteAnalyticsTracker(mockTracker);

      trackAutocompleteEvent({
        type: 'autocomplete_suggestion_accepted',
        userInput: 'exe',
        suggestion: 'Exercise 10 minutes',
        acceptMethod: 'tab',
        inputLength: 3,
        keystrokesSaved: 17,
        timestamp: Date.now(),
      });

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'autocomplete_suggestion_accepted',
          acceptMethod: 'tab',
          keystrokesSaved: 17,
        })
      );
    });

    it('tracks autocomplete_suggestion_dismissed event', async () => {
      const { setAutocompleteAnalyticsTracker, trackAutocompleteEvent } =
        await import('../analytics');

      setAutocompleteAnalyticsTracker(mockTracker);

      trackAutocompleteEvent({
        type: 'autocomplete_suggestion_dismissed',
        userInput: 'exe',
        suggestion: 'Exercise 10 minutes',
        dismissMethod: 'escape',
        timestamp: Date.now(),
      });

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'autocomplete_suggestion_dismissed',
          dismissMethod: 'escape',
        })
      );
    });

    it('tracks autocomplete_suggestion_ignored event', async () => {
      const { setAutocompleteAnalyticsTracker, trackAutocompleteEvent } =
        await import('../analytics');

      setAutocompleteAnalyticsTracker(mockTracker);

      trackAutocompleteEvent({
        type: 'autocomplete_suggestion_ignored',
        userInput: 'exe',
        suggestion: 'Exercise 10 minutes',
        finalInput: 'Something else',
        timestamp: Date.now(),
      });

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'autocomplete_suggestion_ignored',
          finalInput: 'Something else',
        })
      );
    });

    it('tracks autocomplete_no_match event', async () => {
      const { setAutocompleteAnalyticsTracker, trackAutocompleteEvent } =
        await import('../analytics');

      setAutocompleteAnalyticsTracker(mockTracker);

      trackAutocompleteEvent({
        type: 'autocomplete_no_match',
        userInput: 'zzz',
        inputLength: 3,
        timestamp: Date.now(),
      });

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'autocomplete_no_match',
          userInput: 'zzz',
        })
      );
    });

    it('handles tracker errors gracefully', async () => {
      const { setAutocompleteAnalyticsTracker, trackAutocompleteEvent } =
        await import('../analytics');

      const errorTracker = {
        track: () => {
          throw new Error('Tracker error');
        },
      };
      setAutocompleteAnalyticsTracker(errorTracker);

      // Should not throw
      expect(() =>
        trackAutocompleteEvent({
          type: 'autocomplete_no_match',
          userInput: 'test',
          inputLength: 4,
          timestamp: Date.now(),
        })
      ).not.toThrow();
    });
  });

  describe('useAutocompleteAnalytics', () => {
    let mockTracker: jest.Mocked<import('../analytics').AutocompleteAnalyticsTracker>;
    let trackSpy: jest.Mock;

    beforeEach(async () => {
      trackSpy = jest.fn();
      mockTracker = { track: trackSpy };
      const { setAutocompleteAnalyticsTracker } = await import('../analytics');
      setAutocompleteAnalyticsTracker(mockTracker);
    });

    it('provides trackSuggestionShown function', async () => {
      const { useAutocompleteAnalytics } = await import('../analytics');
      const { result } = renderHook(() => useAutocompleteAnalytics());

      result.current.trackSuggestionShown('exe', 'Exercise 10 minutes', 'prefix');

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'autocomplete_suggestion_shown',
          userInput: 'exe',
          suggestion: 'Exercise 10 minutes',
          matchType: 'prefix',
          inputLength: 3,
        })
      );
    });

    it('provides trackSuggestionAccepted function', async () => {
      const { useAutocompleteAnalytics } = await import('../analytics');
      const { result } = renderHook(() => useAutocompleteAnalytics());

      result.current.trackSuggestionAccepted(
        'exe',
        'Exercise 10 minutes',
        'tab'
      );

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'autocomplete_suggestion_accepted',
          userInput: 'exe',
          suggestion: 'Exercise 10 minutes',
          acceptMethod: 'tab',
          keystrokesSaved: 17, // "Exercise 10 minutes" - "exe" = 17 chars
        })
      );
    });

    it('provides trackSuggestionDismissed function', async () => {
      const { useAutocompleteAnalytics } = await import('../analytics');
      const { result } = renderHook(() => useAutocompleteAnalytics());

      result.current.trackSuggestionDismissed(
        'exe',
        'Exercise 10 minutes',
        'escape'
      );

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'autocomplete_suggestion_dismissed',
          userInput: 'exe',
          suggestion: 'Exercise 10 minutes',
          dismissMethod: 'escape',
        })
      );
    });

    it('provides trackSuggestionIgnored function', async () => {
      const { useAutocompleteAnalytics } = await import('../analytics');
      const { result } = renderHook(() => useAutocompleteAnalytics());

      result.current.trackSuggestionIgnored(
        'exe',
        'Exercise 10 minutes',
        'Custom habit'
      );

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'autocomplete_suggestion_ignored',
          userInput: 'exe',
          suggestion: 'Exercise 10 minutes',
          finalInput: 'Custom habit',
        })
      );
    });

    it('provides trackNoMatch function', async () => {
      const { useAutocompleteAnalytics } = await import('../analytics');
      const { result } = renderHook(() => useAutocompleteAnalytics());

      result.current.trackNoMatch('zzz');

      expect(trackSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'autocomplete_no_match',
          userInput: 'zzz',
          inputLength: 3,
        })
      );
    });
  });
});
