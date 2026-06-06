/**
 * Shared horizontal insets for the habits list week strip and habit card chain row.
 *
 * Chain toggles and calendar date rings both use 7× flex-1 columns with 44px controls.
 * Card chain padding must compensate for the left accent strip and the card shell border
 * (see buildStaticCardStyle borderWidth) so the chain tract matches DayStrip width.
 */

export const HABITS_LIST_HORIZONTAL_PADDING = 24;

/** Calendar week strip padding and outer edge of habit card chain toggles. */
export const WEEK_STRIP_HORIZONTAL_PADDING = 40;

export const HABIT_CARD_ACCENT_WIDTH = 4;

/** Normal-mode card border — must match buildStaticCardStyle borderWidth (non-HC). */
export const HABIT_CARD_BORDER_WIDTH = 1;

/** Inner chain left inset after list padding, card border, and accent strip. */
export const HABIT_CARD_CHAIN_PADDING_LEFT =
  WEEK_STRIP_HORIZONTAL_PADDING -
  HABITS_LIST_HORIZONTAL_PADDING -
  HABIT_CARD_ACCENT_WIDTH -
  HABIT_CARD_BORDER_WIDTH;

/** Inner chain right inset after list padding and card border (no accent on right). */
export const HABIT_CARD_CHAIN_PADDING_RIGHT =
  WEEK_STRIP_HORIZONTAL_PADDING -
  HABITS_LIST_HORIZONTAL_PADDING -
  HABIT_CARD_BORDER_WIDTH;
