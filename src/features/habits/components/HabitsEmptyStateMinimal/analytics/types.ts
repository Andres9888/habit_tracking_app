/**
 * Analytics Type Definitions
 * Types for Time-Based Suggestion Chips analytics
 */

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
      timeToConversion: number;
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
      dayOfWeek: number;
      timestamp: number;
    };

/**
 * Analytics tracker interface
 * Implement this interface to connect to your analytics provider
 */
export interface TimeBasedChipAnalyticsTracker {
  track(event: TimeBasedChipEvent): void;
}
