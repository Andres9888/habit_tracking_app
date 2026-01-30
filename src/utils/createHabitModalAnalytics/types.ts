/**
 * Analytics event types for Create Habit Modal V11
 */

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
  | { type: 'button_enabled'; nameLength: number; timeToEnable: number }
  | { type: 'swipe_dismissal_used'; swipeDistance: number; velocity: number }
  | {
      type: 'character_counter_warning_shown';
      characterCount: number;
      warningLevel: 'normal' | 'warning' | 'error';
    }
  | {
      type: 'habit_creation_completed';
      timeToComplete: number;
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
