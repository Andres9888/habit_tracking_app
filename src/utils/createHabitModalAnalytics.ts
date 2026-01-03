/**
 * Analytics tracking utilities for Create Habit Modal V11
 *
 * This module provides type-safe analytics event tracking for monitoring
 * V11 feature usage and measuring impact on user behavior.
 */

// Analytics event types for Create Habit Modal V11
export type CreateHabitModalEvent =
  | { type: 'habit_creation_started'; source: 'create_habit_modal_v11' }
  | {
      type: 'live_preview_updated';
      hasName: boolean;
      hasEmoji: boolean;
      hasColor: boolean;
    }
  | {
      type: 'emoji_suggestion_used';
      keyword: string | null;
      emojiSelected: string;
      fromSuggestions: boolean;
      wasSmartSuggestion: boolean;
    }
  | {
      type: 'smart_reminder_default_accepted';
      timeOfDay: 'morning' | 'midday' | 'evening';
      reminderSelected: string;
      wasSmartDefault: boolean;
    }
  | {
      type: 'button_enabled';
      nameLength: number;
      timeToEnable: number; // milliseconds
    }
  | {
      type: 'swipe_dismissal_used';
      swipeDistance: number;
      velocity: number;
    }
  | {
      type: 'character_counter_warning_shown';
      characterCount: number;
      warningLevel: 'normal' | 'warning' | 'error';
    }
  | {
      type: 'habit_creation_completed';
      timeToComplete: number; // milliseconds
      usedSmartEmoji: boolean;
      usedSmartReminder: boolean;
      nameLength: number;
      hasReminder: boolean;
    }
  | {
      type: 'emoji_picker_opened';
      reason: 'manual_click' | 'no_suggestion_match';
      currentHabitName: string;
    }
  | {
      type: 'selection_animation_played';
      animationType: 'emoji' | 'color' | 'reminder';
      reducedMotion: boolean;
    };

/**
 * Analytics tracker interface
 * Implement this interface to connect to your analytics provider
 */
export interface AnalyticsTracker {
  track(event: CreateHabitModalEvent): void;
}

/**
 * Console logger for development
 * Logs all analytics events to console in development mode
 */
class ConsoleAnalyticsTracker implements AnalyticsTracker {
  private enabled: boolean;

  constructor() {
    this.enabled = __DEV__;
  }

  track(event: CreateHabitModalEvent): void {
    if (!this.enabled) return;

    console.log('[Analytics] Create Habit Modal V11:', {
      type: event.type,
      timestamp: new Date().toISOString(),
      ...event,
    });
  }
}

/**
 * No-op tracker for production when no analytics provider configured
 */
class NoOpAnalyticsTracker implements AnalyticsTracker {
  track(_event: CreateHabitModalEvent): void {
    // No-op
  }
}

/**
 * Global analytics tracker instance
 * Override with setAnalyticsTracker() to connect your analytics provider
 */
let analyticsTracker: AnalyticsTracker = __DEV__
  ? new ConsoleAnalyticsTracker()
  : new NoOpAnalyticsTracker();

/**
 * Set custom analytics tracker
 * Call this early in your app initialization to connect your analytics provider
 *
 * @example
 * ```ts
 * import { setAnalyticsTracker } from '@/utils/createHabitModalAnalytics';
 * import analytics from '@/lib/analytics';
 *
 * setAnalyticsTracker({
 *   track: (event) => {
 *     analytics.track(event.type, event);
 *   }
 * });
 * ```
 */
export function setAnalyticsTracker(tracker: AnalyticsTracker): void {
  analyticsTracker = tracker;
}

/**
 * Track analytics event
 * Type-safe wrapper around the global analytics tracker
 */
export function trackEvent(event: CreateHabitModalEvent): void {
  try {
    analyticsTracker.track(event);
  } catch (error) {
    // Silently fail - don't let analytics errors break the app
    if (__DEV__) {
      console.error('[Analytics] Error tracking event:', error);
    }
  }
}

/**
 * Helper: Get time of day category for smart reminder tracking
 */
export function getTimeOfDay(): 'morning' | 'midday' | 'evening' {
  const hour = new Date().getHours();
  if (hour >= 7 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 20) return 'midday';
  return 'evening';
}

/**
 * Helper: Get warning level for character counter
 */
export function getCharacterCountWarningLevel(
  count: number
): 'normal' | 'warning' | 'error' {
  if (count > 40) return 'error';
  if (count > 30) return 'warning';
  return 'normal';
}

/**
 * Hook for tracking Create Habit Modal V11 analytics
 * Use this hook in CreateHabitModal component to track user interactions
 *
 * @example
 * ```tsx
 * const analytics = useCreateHabitModalAnalytics();
 *
 * // Track modal opened
 * useEffect(() => {
 *   if (visible) {
 *     analytics.trackCreationStarted();
 *   }
 * }, [visible]);
 *
 * // Track live preview updates
 * useEffect(() => {
 *   analytics.trackLivePreviewUpdated({
 *     hasName: habitName.length > 0,
 *     hasEmoji: emoji !== '🎯',
 *     hasColor: color !== '#10b981'
 *   });
 * }, [habitName, emoji, color]);
 * ```
 */
export function useCreateHabitModalAnalytics() {
  return {
    /**
     * Track when modal is opened and creation starts
     */
    trackCreationStarted: () => {
      trackEvent({
        type: 'habit_creation_started',
        source: 'create_habit_modal_v11',
      });
    },

    /**
     * Track live preview updates as user types
     */
    trackLivePreviewUpdated: (data: {
      hasName: boolean;
      hasEmoji: boolean;
      hasColor: boolean;
    }) => {
      trackEvent({
        type: 'live_preview_updated',
        ...data,
      });
    },

    /**
     * Track emoji selection from smart suggestions
     */
    trackEmojiSuggestionUsed: (data: {
      keyword: string | null;
      emojiSelected: string;
      fromSuggestions: boolean;
      wasSmartSuggestion: boolean;
    }) => {
      trackEvent({
        type: 'emoji_suggestion_used',
        ...data,
      });
    },

    /**
     * Track smart reminder default acceptance
     */
    trackSmartReminderDefaultAccepted: (data: {
      timeOfDay: 'morning' | 'midday' | 'evening';
      reminderSelected: string;
      wasSmartDefault: boolean;
    }) => {
      trackEvent({
        type: 'smart_reminder_default_accepted',
        ...data,
      });
    },

    /**
     * Track when button becomes enabled (2+ characters)
     */
    trackButtonEnabled: (data: { nameLength: number; timeToEnable: number }) => {
      trackEvent({
        type: 'button_enabled',
        ...data,
      });
    },

    /**
     * Track swipe dismissal usage
     */
    trackSwipeDismissalUsed: (data: { swipeDistance: number; velocity: number }) => {
      trackEvent({
        type: 'swipe_dismissal_used',
        ...data,
      });
    },

    /**
     * Track character counter warning states
     */
    trackCharacterCounterWarningShown: (data: {
      characterCount: number;
      warningLevel: 'normal' | 'warning' | 'error';
    }) => {
      trackEvent({
        type: 'character_counter_warning_shown',
        ...data,
      });
    },

    /**
     * Track successful habit creation
     */
    trackHabitCreationCompleted: (data: {
      timeToComplete: number;
      usedSmartEmoji: boolean;
      usedSmartReminder: boolean;
      nameLength: number;
      hasReminder: boolean;
    }) => {
      trackEvent({
        type: 'habit_creation_completed',
        ...data,
      });
    },

    /**
     * Track emoji picker manual open
     */
    trackEmojiPickerOpened: (data: {
      reason: 'manual_click' | 'no_suggestion_match';
      currentHabitName: string;
    }) => {
      trackEvent({
        type: 'emoji_picker_opened',
        ...data,
      });
    },

    /**
     * Track selection animations
     */
    trackSelectionAnimationPlayed: (data: {
      animationType: 'emoji' | 'color' | 'reminder';
      reducedMotion: boolean;
    }) => {
      trackEvent({
        type: 'selection_animation_played',
        ...data,
      });
    },
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
 * import { setAnalyticsTracker } from '@/utils/createHabitModalAnalytics';
 *
 * setAnalyticsTracker({
 *   track: (event) => {
 *     analytics.track(event.type, event);
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
 * import { setAnalyticsTracker } from '@/utils/createHabitModalAnalytics';
 *
 * const mixpanel = new Mixpanel('YOUR_TOKEN');
 *
 * setAnalyticsTracker({
 *   track: (event) => {
 *     const { type, ...properties } = event;
 *     mixpanel.track(type, properties);
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
 * import { setAnalyticsTracker } from '@/utils/createHabitModalAnalytics';
 *
 * setAnalyticsTracker({
 *   track: (event) => {
 *     const { type, ...properties } = event;
 *     Amplitude.track(type, properties);
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
 * import { setAnalyticsTracker } from '@/utils/createHabitModalAnalytics';
 *
 * // In your app initialization:
 * const trackAnalyticsEvent = useMutation(api.analytics.trackEvent);
 *
 * setAnalyticsTracker({
 *   track: (event) => {
 *     trackAnalyticsEvent({
 *       eventType: event.type,
 *       properties: event,
 *       timestamp: Date.now()
 *     });
 *   }
 * });
 * ```
 */
