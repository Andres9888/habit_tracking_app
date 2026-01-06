/**
 * Analytics tracking utilities for Time-Based Suggestion Chips
 *
 * This module provides type-safe analytics event tracking for monitoring
 * time-based chip feature usage and measuring impact on user behavior.
 *
 * Tracks key metrics:
 * - Chip selection rate by time window
 * - Time to first habit creation
 * - Chip-to-habit conversion rate
 * - Time window engagement distribution
 */

import type { SuggestionChip } from './types';

/**
 * Time window categories for analytics
 */
export type TimeWindow = 'morning' | 'afternoon' | 'evening' | 'night';

/**
 * Analytics event types for Time-Based Chips feature
 */
export type TimeBasedChipEvent =
  | {
      type: 'chips_displayed';
      timeWindow: TimeWindow;
      hour: number;
      chipLabels: string[];
      timestamp: number;
    }
  | {
      type: 'chip_selected';
      timeWindow: TimeWindow;
      chipLabel: string;
      chipFullName: string;
      chipEmoji: string;
      chipIndex: number;
      hour: number;
      timestamp: number;
    }
  | {
      type: 'chip_deselected';
      timeWindow: TimeWindow;
      chipLabel: string;
      chipIndex: number;
      previouslySelected: boolean;
      timestamp: number;
    }
  | {
      type: 'chip_converted_to_habit';
      timeWindow: TimeWindow;
      chipLabel: string;
      chipFullName: string;
      chipEmoji: string;
      chipIndex: number;
      timeToConversion: number; // milliseconds from display to habit creation
      timestamp: number;
    }
  | {
      type: 'manual_input_after_chip_view';
      timeWindow: TimeWindow;
      manualHabitName: string;
      chipsViewed: string[];
      timestamp: number;
    }
  | {
      type: 'time_window_distribution';
      timeWindow: TimeWindow;
      hour: number;
      dayOfWeek: number; // 0-6 (Sunday-Saturday)
      timestamp: number;
    };

/**
 * Analytics tracker interface
 * Implement this interface to connect to your analytics provider
 */
export interface TimeBasedChipAnalyticsTracker {
  track(event: TimeBasedChipEvent): void;
}

/**
 * Console logger for development
 * Logs all analytics events to console in development mode
 */
class ConsoleTimeBasedChipAnalyticsTracker implements TimeBasedChipAnalyticsTracker {
  private enabled: boolean;

  constructor() {
    this.enabled = __DEV__;
  }

  track(event: TimeBasedChipEvent): void {
    if (!this.enabled) return;

    // eslint-disable-next-line no-console
    console.log('[Analytics] Time-Based Chips:', {
      timestamp: new Date(event.timestamp).toISOString(),
      type: event.type,
      ...event,
    });
  }
}

/**
 * No-op tracker for production when no analytics provider configured
 */
class NoOpTimeBasedChipAnalyticsTracker implements TimeBasedChipAnalyticsTracker {
  track(_event: TimeBasedChipEvent): void {
    // No-op
  }
}

/**
 * Global analytics tracker instance
 * Override with setTimeBasedChipAnalyticsTracker() to connect your analytics provider
 */
let analyticsTracker: TimeBasedChipAnalyticsTracker = __DEV__
  ? new ConsoleTimeBasedChipAnalyticsTracker()
  : new NoOpTimeBasedChipAnalyticsTracker();

/**
 * Set custom analytics tracker
 * Call this early in your app initialization to connect your analytics provider
 *
 * @example
 * ```ts
 * import { setTimeBasedChipAnalyticsTracker } from '@/features/habits/components/HabitsEmptyStateMinimal/analytics';
 * import analytics from '@/lib/analytics';
 *
 * setTimeBasedChipAnalyticsTracker({
 *   track: (event) => {
 *     analytics.track(event.type, event);
 *   }
 * });
 * ```
 */
export function setTimeBasedChipAnalyticsTracker(
  tracker: TimeBasedChipAnalyticsTracker
): void {
  analyticsTracker = tracker;
}

/**
 * Track analytics event
 * Type-safe wrapper around the global analytics tracker
 */
export function trackTimeBasedChipEvent(event: TimeBasedChipEvent): void {
  try {
    analyticsTracker.track(event);
  } catch (error) {
    // Silently fail - don't let analytics errors break the app
    if (__DEV__) {
      console.error('[Analytics] Error tracking time-based chip event:', error);
    }
  }
}

/**
 * Helper: Get time window category from hour
 */
export function getTimeWindowFromHour(hour: number): TimeWindow {
  if (hour >= 5 && hour < 11) return 'morning';
  if (hour >= 11 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 22) return 'evening';
  return 'night';
}

/**
 * Helper: Get chip labels array from chips
 */
export function getChipLabels(chips: SuggestionChip[]): string[] {
  return chips.map((chip) => chip.label);
}

/**
 * Track when user first views chips
 */
function createTrackChipsDisplayed() {
  return (chips: SuggestionChip[]) => {
    const now = new Date();
    const hour = now.getHours();
    const timeWindow = getTimeWindowFromHour(hour);

    trackTimeBasedChipEvent({
      chipLabels: getChipLabels(chips),
      hour,
      timestamp: now.getTime(),
      timeWindow,
      type: 'chips_displayed',
    });

    // Also track time window distribution for analytics
    trackTimeBasedChipEvent({
      dayOfWeek: now.getDay(),
      hour,
      timestamp: now.getTime(),
      timeWindow,
      type: 'time_window_distribution',
    });
  };
}

/**
 * Track chip selection
 */
function createTrackChipSelected() {
  return (chip: SuggestionChip, index: number) => {
    const now = new Date();
    const hour = now.getHours();
    const timeWindow = getTimeWindowFromHour(hour);

    trackTimeBasedChipEvent({
      chipEmoji: chip.emoji,
      chipFullName: chip.fullName,
      chipIndex: index,
      chipLabel: chip.label,
      hour,
      timestamp: now.getTime(),
      timeWindow,
      type: 'chip_selected',
    });
  };
}

/**
 * Track chip deselection (when user clicks away or selects different chip)
 */
function createTrackChipDeselected() {
  return (chip: SuggestionChip, index: number) => {
    const now = new Date();
    const hour = now.getHours();
    const timeWindow = getTimeWindowFromHour(hour);

    trackTimeBasedChipEvent({
      chipIndex: index,
      chipLabel: chip.label,
      previouslySelected: true,
      timestamp: now.getTime(),
      timeWindow,
      type: 'chip_deselected',
    });
  };
}

/**
 * Track successful chip-to-habit conversion
 */
function createTrackChipConvertedToHabit() {
  return (chip: SuggestionChip, index: number, displayTimestamp: number) => {
    const now = new Date();
    const hour = now.getHours();
    const timeWindow = getTimeWindowFromHour(hour);
    const timeToConversion = now.getTime() - displayTimestamp;

    trackTimeBasedChipEvent({
      chipEmoji: chip.emoji,
      chipFullName: chip.fullName,
      chipIndex: index,
      chipLabel: chip.label,
      timestamp: now.getTime(),
      timeToConversion,
      timeWindow,
      type: 'chip_converted_to_habit',
    });
  };
}

/**
 * Track when user types manually instead of using chips
 */
function createTrackManualInputAfterChipView() {
  return (habitName: string, viewedChips: SuggestionChip[]) => {
    const now = new Date();
    const hour = now.getHours();
    const timeWindow = getTimeWindowFromHour(hour);

    trackTimeBasedChipEvent({
      chipsViewed: getChipLabels(viewedChips),
      manualHabitName: habitName,
      timestamp: now.getTime(),
      timeWindow,
      type: 'manual_input_after_chip_view',
    });
  };
}

/**
 * Hook for tracking Time-Based Chip analytics
 * Use this hook in SuggestionChips component to track user interactions
 *
 * @example
 * ```tsx
 * const analytics = useTimeBasedChipAnalytics();
 *
 * // Track chips displayed
 * useEffect(() => {
 *   analytics.trackChipsDisplayed(chips);
 * }, [chips]);
 *
 * // Track chip selection
 * const handleChipSelect = (index: number, chip: SuggestionChip) => {
 *   analytics.trackChipSelected(chip, index);
 *   onSelect(index, chip);
 * };
 * ```
 */
export function useTimeBasedChipAnalytics() {
  return {
    trackChipConvertedToHabit: createTrackChipConvertedToHabit(),
    trackChipDeselected: createTrackChipDeselected(),
    trackChipsDisplayed: createTrackChipsDisplayed(),
    trackChipSelected: createTrackChipSelected(),
    trackManualInputAfterChipView: createTrackManualInputAfterChipView(),
  };
}

/**
 * Example integration with popular analytics providers
 */

/**
 * Segment integration example
 *
 * @example
 * ```ts
 * import analytics from '@segment/analytics-react-native';
 * import { setTimeBasedChipAnalyticsTracker } from '@/features/habits/components/HabitsEmptyStateMinimal/analytics';
 *
 * setTimeBasedChipAnalyticsTracker({
 *   track: (event) => {
 *     analytics.track(event.type, {
 *       ...event,
 *       feature: 'time_based_chips',
 *       version: '1.0'
 *     });
 *   }
 * });
 * ```
 */

/**
 * Mixpanel integration example
 *
 * @example
 * ```ts
 * import { Mixpanel } from 'mixpanel-react-native';
 * import { setTimeBasedChipAnalyticsTracker } from '@/features/habits/components/HabitsEmptyStateMinimal/analytics';
 *
 * const mixpanel = new Mixpanel('YOUR_TOKEN');
 *
 * setTimeBasedChipAnalyticsTracker({
 *   track: (event) => {
 *     const { type, ...properties } = event;
 *     mixpanel.track(`TimeBased_${type}`, {
 *       ...properties,
 *       feature_flag: 'time_based_chips_v1'
 *     });
 *   }
 * });
 * ```
 */

/**
 * Amplitude integration example
 *
 * @example
 * ```ts
 * import * as Amplitude from '@amplitude/analytics-react-native';
 * import { setTimeBasedChipAnalyticsTracker } from '@/features/habits/components/HabitsEmptyStateMinimal/analytics';
 *
 * setTimeBasedChipAnalyticsTracker({
 *   track: (event) => {
 *     const { type, timestamp, ...properties } = event;
 *     Amplitude.track({
 *       event_type: `time_based_chips.${type}`,
 *       event_properties: properties,
 *       time: timestamp
 *     });
 *   }
 * });
 * ```
 */

/**
 * Custom Convex integration example (for this project)
 *
 * @example
 * ```ts
 * import { useMutation } from 'convex/react';
 * import { api } from '@/convex/_generated/api';
 * import { setTimeBasedChipAnalyticsTracker } from '@/features/habits/components/HabitsEmptyStateMinimal/analytics';
 *
 * // In your app initialization:
 * const trackAnalyticsEvent = useMutation(api.analytics.trackTimeBasedChips);
 *
 * setTimeBasedChipAnalyticsTracker({
 *   track: (event) => {
 *     trackAnalyticsEvent({
 *       eventType: event.type,
 *       properties: {
 *         timeWindow: event.timeWindow,
 *         ...event
 *       },
 *       timestamp: event.timestamp
 *     });
 *   }
 * });
 * ```
 */
