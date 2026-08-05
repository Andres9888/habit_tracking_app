/**
 * Hooks - Centralized barrel export
 *
 * All custom hooks for the Chain Day habit tracking app.
 * Organized by category for better discoverability.
 */

// ============================================================================
// ANIMATION & INTERACTION
// ============================================================================

export {
  usePressAnimation,
  type PressAnimationConfig,
  type PressAnimationHandlers,
  type UsePressAnimationReturn,
} from './usePressAnimation';

export { useReduceMotion } from './useReduceMotion';

// ============================================================================
// HAPTICS & FEEDBACK
// ============================================================================

export {
  useCelebrationHaptics,
  default as CelebrationHaptics,
} from './useCelebrationHaptics';

export {
  useHapticFeedback,
  default as HapticFeedback,
} from './useHapticFeedback';

export {
  useCompletionSound,
  default as CompletionSound,
} from './useCompletionSound';

// ============================================================================
// HABIT MANAGEMENT
// ============================================================================

export { useHabitStrength, default as HabitStrength } from './useHabitStrength';

export {
  useToggleHabitWithTimezone,
  default as ToggleHabitWithTimezone,
} from './useToggleHabitWithTimezone';

export { useOfflineHabitMutations } from './useOfflineHabitMutations';

// ============================================================================
// MILESTONES & NOTIFICATIONS
// ============================================================================

export {
  useMilestoneDetection,
  useMultiMilestoneDetection,
  checkMilestoneCrossed,
  MILESTONE_THRESHOLDS,
  type MilestoneAchievement,
  type UseMilestoneDetectionReturn,
  type UseMultiMilestoneDetectionReturn,
} from './useMilestoneDetection';

export {
  useNotificationResponse,
  default as NotificationResponse,
} from './useNotificationResponse';

export {
  useStreakReminders,
  useStreakReminderSettings,
  type StreakReminderHabit,
} from './useStreakReminders';

// ============================================================================
// MEDIA & STORAGE
// ============================================================================

export {
  useImagePicker,
  type ImagePickerOptions,
  type ImageSource,
  type PickedImage,
  type UseImagePickerReturn,
} from './useImagePicker';

export {
  useImageUpload,
  type UploadResult,
  type UseImageUploadReturn,
} from './useImageUpload';

export {
  useAudioPlayback,
  type UseAudioPlaybackReturn,
} from './useAudioPlayback';

export {
  useAudioRecording,
  type UseAudioRecordingReturn,
} from './useAudioRecording';

// ============================================================================
// OFFLINE & NETWORK
// ============================================================================

export {
  useOfflineQueue,
  type OfflineSubmissionType,
  type QueuedSubmission,
  type UseOfflineQueueReturn,
} from './useOfflineQueue';

// ============================================================================
// PREMIUM FEATURES
// ============================================================================

export { usePremium, type UsePremiumReturn } from './usePremium';

// ============================================================================
// RESCUE & RECOVERY
// ============================================================================

export {
  useRescueTrigger,
  isInQuietHoursWindow,
  type RescueEligibleHabit,
  type QuietHoursConfig,
  type RescueTriggerConfig,
  type RescueTriggerResult,
} from './useRescueTrigger';

// ============================================================================
// UI & NAVIGATION
// ============================================================================

export { useKeyboardVisible } from './useKeyboardVisible';

export {
  useUnsavedChangesGuard,
  type UseUnsavedChangesGuardOptions,
  type UseUnsavedChangesGuardReturn,
} from './useUnsavedChangesGuard';

export {
  useDraftStorage,
  type StoredDraft as DraftData,
  type UseDraftStorageReturn,
} from './useDraftStorage';

// ============================================================================
// UTILITIES
// ============================================================================

export { useRetryableAction } from './useRetryableAction';
