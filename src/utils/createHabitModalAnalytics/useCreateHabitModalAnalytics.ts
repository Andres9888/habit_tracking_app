import { trackEvent } from './trackers';

/**
 * Hook for tracking Create Habit Modal V11 analytics
 * Use this hook in CreateHabitModal component to track user interactions
 */
export function useCreateHabitModalAnalytics() {
  return {
    /** Track when button becomes enabled (2+ characters) */
    trackButtonEnabled: (data: {
      nameLength: number;
      timeToEnable: number;
    }) => {
      trackEvent({ type: 'button_enabled', ...data });
    },

    /** Track character counter warning states */
    trackCharacterCounterWarningShown: (data: {
      characterCount: number;
      warningLevel: 'normal' | 'warning' | 'error';
    }) => {
      trackEvent({ type: 'character_counter_warning_shown', ...data });
    },

    /** Track when modal is opened and creation starts */
    trackCreationStarted: () => {
      trackEvent({
        source: 'create_habit_modal_v11',
        type: 'habit_creation_started',
      });
    },

    /** Track emoji picker manual open */
    trackEmojiPickerOpened: (data: {
      reason: 'manual_click' | 'no_suggestion_match';
      currentHabitName: string;
    }) => {
      trackEvent({ type: 'emoji_picker_opened', ...data });
    },

    /** Track emoji selection from smart suggestions */
    trackEmojiSuggestionUsed: (data: {
      keyword: string | null;
      emojiSelected: string;
      fromSuggestions: boolean;
      wasSmartSuggestion: boolean;
    }) => {
      trackEvent({ type: 'emoji_suggestion_used', ...data });
    },

    /** Track successful habit creation */
    trackHabitCreationCompleted: (data: {
      timeToComplete: number;
      usedSmartEmoji: boolean;
      usedSmartReminder: boolean;
      nameLength: number;
      hasReminder: boolean;
    }) => {
      trackEvent({ type: 'habit_creation_completed', ...data });
    },

    /** Track live preview updates as user types */
    trackLivePreviewUpdated: (data: {
      hasName: boolean;
      hasEmoji: boolean;
      hasColor: boolean;
    }) => {
      trackEvent({ type: 'live_preview_updated', ...data });
    },

    /** Track selection animations */
    trackSelectionAnimationPlayed: (data: {
      animationType: 'emoji' | 'color' | 'reminder';
      reducedMotion: boolean;
    }) => {
      trackEvent({ type: 'selection_animation_played', ...data });
    },

    /** Track smart reminder default acceptance */
    trackSmartReminderDefaultAccepted: (data: {
      timeOfDay: 'morning' | 'midday' | 'evening';
      reminderSelected: string;
      wasSmartDefault: boolean;
    }) => {
      trackEvent({ type: 'smart_reminder_default_accepted', ...data });
    },

    /** Track swipe dismissal usage */
    trackSwipeDismissalUsed: (data: {
      swipeDistance: number;
      velocity: number;
    }) => {
      trackEvent({ type: 'swipe_dismissal_used', ...data });
    },
  };
}
