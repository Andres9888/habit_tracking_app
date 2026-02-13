/**
 * HabitsEmptyStateMinimal - TypeScript Interfaces
 *
 * Type definitions for the minimal empty state component.
 */

/**
 * Suggestion chip data structure
 */
export interface SuggestionChip {
  /** Emoji icon displayed in the chip */
  emoji: string;
  /** Short label (1-2 words) */
  label: string;
  /** Full habit name used when creating the habit */
  fullName: string;
}

/**
 * Main component props
 */
export interface HabitsEmptyStateMinimalProps {
  /** Whether the component is in a loading state */
  isLoading?: boolean;

  /** Callback when user submits a habit to create */
  onQuickCreateHabit: (habitName: string) => Promise<void>;

  /** Callback to open the templates screen */
  openTemplatesScreen: () => void;

  /** Callback to open the full create habit modal */
  openCreateHabitScreen: () => void;

  /** Callback when success transition completes (habit list should now show) */
  onSuccessTransitionComplete?: () => void;
}

/**
 * HeroIcon component props
 */
export interface HeroIconProps {
  /** Whether to animate the breathing effect */
  animate?: boolean;
  /** Icon container size in pixels (default: 80) */
  size?: number;
  /** Emoji font size in pixels (default: 36) */
  emojiSize?: number;
}

/**
 * HabitInput component props
 */
export interface HabitInputProps {
  /** Current input value */
  value: string;
  /** Callback when input value changes */
  onChangeText: (text: string) => void;
  /** Callback when input is focused */
  onFocus?: () => void;
  /** Callback when input is blurred */
  onBlur?: () => void;
  /** Callback when keyboard submit (Done) is pressed */
  onSubmitEditing?: () => void;
  /** Callback when clear button is pressed */
  onClear?: () => void;
}

/**
 * SuggestionChips component props
 */
export interface SuggestionChipsProps {
  /** Currently selected chip index (null if none selected) */
  selectedIndex: number | null;
  /** Callback when a chip is selected */
  onSelect: (index: number, chip: SuggestionChip) => void;
  /**
   * Whether user is idle (triggers breathing animation)
   * Animation creates gentle "alive" feeling when user is reading/thinking
   * @default false
   */
  isIdle?: boolean;
}

/**
 * CtaButton component props
 */
export interface CtaButtonProps {
  /** Whether the button is disabled */
  disabled: boolean;
  /** Whether the button is in a loading state */
  isLoading?: boolean;
  /** Callback when button is pressed */
  onPress: () => void;
}

/**
 * SecondaryLinks component props
 */
export interface SecondaryLinksProps {
  /** Callback to open templates screen */
  onBrowseTemplates: () => void;
  /** Callback to open create habit modal */
  onCreateCustom: () => void;
}

/**
 * InlineHint component props
 */
export interface InlineHintProps {
  /** Callback to open templates screen */
  onBrowseTemplates: () => void;
  /** Callback to open create habit modal */
  onCreateCustom: () => void;
}

/**

/**
 * SuccessState component props
 */
export interface SuccessStateProps {
  /** Name of the habit that was created */
  habitName: string;
  /** Emoji for the habit (shows in success icon for visual continuity) */
  habitEmoji?: string;
  /** Callback to add another habit (resets to initial state) */
  onAddAnother: () => void;
  /** Callback to open the templates screen */
  onBrowseTemplates?: () => void;
  /** Callback when exit transition completes (for transitioning to list) */
  onTransitionComplete?: () => void;
  /** Whether to auto-transition to list after celebration (default: true) */
  autoTransition?: boolean;
}

/**
 * Component state for the main index.tsx
 */
export interface EmptyStateState {
  /** Current text input value */
  inputValue: string;
  /** Selected chip index (null if none) */
  selectedChipIndex: number | null;
  /** Whether the input is focused */
  isInputFocused: boolean;
  /** Whether habit creation is in progress */
  isCreating: boolean;
  /** Habit name shown in success state (null if not showing success) */
  successHabitName: string | null;
}

/**
 * ErrorMessage component props
 */
export interface ErrorMessageProps {
  /** Error message to display */
  message: string;
  /** Callback when dismiss button is pressed */
  onDismiss: () => void;
  /** Optional auto-dismiss after delay (uses ERROR_ANIMATION.autoDismissDelay if not specified) */
  autoDismiss?: boolean;
}
