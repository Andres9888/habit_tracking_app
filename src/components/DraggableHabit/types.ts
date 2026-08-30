/**
 * @module DraggableHabit/types
 *
 * Core type definitions for the DraggableHabit component family.
 *
 * This file defines the domain types (Habit, HabitStatus) and the top-level
 * component props (DraggableHabitProps). For the internal card-level props
 * used after state/animation computation, see {@link DraggableHabitCard.types.ts}.
 */

import type { Id } from '../../../convex/_generated/dataModel';
import type { HabitCardEntranceVariant } from '../HabitCard/useHabitCardEntrance';
import type {
  ProgressEmojiSet,
  PartialProgressEmojiSet,
} from '../../utils/progressEmojis';

/** Completion status for a single day in the week view. */
export type HabitStatus = 'done' | 'missed' | 'planned';

/**
 * A habit record from the Convex backend.
 *
 * Includes core identity (name, icon, color), streak/strength metadata,
 * and optional organisational fields (tags, order, archived).
 */
export interface Habit {
  _id: Id<'habits'>;
  name: string;
  notes?: string;
  createdAt: number;
  _creationTime: number;
  /** Custom emoji icon (overrides emoji extracted from name). */
  icon?: string;
  /** Explicit accent color hex (overrides deterministic color picker). */
  color?: string;
  /** @deprecated Legacy field — use `color` instead. */
  iconColor?: string;
  /** Sort position in the habits list (drag-to-reorder). */
  order?: number;
  /** User's preferred time of day, e.g. "morning" | "evening". */
  preferredTime?: string;
  tags?: string[];
  userId?: string;
  archived?: boolean;
  archivedAt?: number;
  /** Habit strength as a 0–1 decimal (server-computed). */
  strength?: number;
  strengthLevel?: string;
  strengthUpdatedAt?: number;
  /** Highest streak ever achieved for this habit. */
  bestStreak?: number;
  progressEmojis?: ProgressEmojiSet;
}

/**
 * Props for the top-level `<DraggableHabit>` component.
 *
 * This is the public API consumed by the habits list. Internally,
 * DraggableHabit derives additional state (colors, animations, press handlers)
 * and passes a flattened {@link DraggableHabitCardProps} to the card renderer.
 */
export interface DraggableHabitProps {
  celebrationsEnabled: boolean;
  completionIcon?: 'chain' | 'checkbox';
  dayShape?: 'circle' | 'square';
  /** Defers progress/fill/week controls for one hidden focus-mount frame. */
  deferHeavyContent?: boolean;
  /** Stagger delay (ms) for entrance animation in a list. */
  entranceDelay?: number;
  entranceVariant?: HabitCardEntranceVariant;
  habit: Habit;
  isCompactMode?: boolean;
  isConnectedToNextWeek?: boolean;
  isConnectedToPreviousWeek?: boolean;
  /** True on the render immediately after the user creates this habit. */
  isJustCreated?: boolean;
  /** Keeps the focus ring fully visible while Home is covered. */
  holdHighlight?: boolean;
  isPaused?: boolean;
  onArchive?: (habitId: Id<'habits'>) => void;
  onDelete?: (habitId: Id<'habits'>) => void;
  onEntranceComplete?: () => void;
  onLongPress?: ((habit?: Habit) => void) | (() => void);
  onPause?: (habitId: Id<'habits'>) => void;
  onPress?: (habit: Habit) => void;
  onResume?: (habitId: Id<'habits'>) => void;
  onWeekComplete?: (args: { habit: Habit; completedDate: string }) => void;
  /** Previous streak value — used to detect new personal records. */
  previousStreak?: number;
  reduceMotionPreference: boolean;
  showConnectors?: boolean;
  showGradientFill?: boolean;
  showHabitStrengthPercentage?: boolean;
  streak: number;
  toggleHabit: (args: { habitId: Id<'habits'>; date: string }) => void;
  triggerEntrance?: boolean;
  userProgressEmojis?: PartialProgressEmojiSet;
  weekDateStrings: string[];
  weekStatus: HabitStatus[];
  /** Selection mode: whether this card is currently selected. */
  isSelected?: boolean;
  /** Selection mode: show the selection checkbox overlay. */
  showSelectionOverlay?: boolean;
  /** Selection mode: called when the checkbox is toggled. */
  onToggleSelection?: () => void;
}

/**
 * Resolved color tokens for rendering a habit card.
 * Computed once by {@link getCardColors} and threaded through sub-components.
 */
export interface CardColors {
  border: string;
  cardBackground: string;
  iconContainer: string | undefined;
  primaryText: string;
  streakText: string;
  strengthBackground: string;
}
