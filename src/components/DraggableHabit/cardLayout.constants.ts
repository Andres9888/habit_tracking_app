/** Shared layout tokens for DraggableHabit card rows (header, strength bar). */

/** Left accent strip width — must match {@link ACCENT_TARGET_WIDTH}. */

/** Card shell border — must match buildStaticCardStyle (non-high-contrast). */

/** Chain row right inset — aligns toggle centers with calendar date rings. */

export const CARD_ICON_SIZE = 36;
export const CARD_ICON_SIZE_COMPACT = 28;

export const CARD_COLUMN_COUNT = 5;
export const CARD_TITLE_GAP = 8;

export const CARD_COL_WIDTH = '20%';
export const CARD_BAR_LEFT = '20%';
export const CARD_BAR_RIGHT = '20%';

export const CARD_SECTION_SPACING = {
  compact: { pb: 12, pt: 12 },
  normal: { pb: 16, pt: 16 },
} as const;

export function getCardIconSize(isCompactMode?: boolean): number {
  return isCompactMode ? CARD_ICON_SIZE_COMPACT : CARD_ICON_SIZE;
}

export {
  HABIT_CARD_ACCENT_WIDTH as CARD_ACCENT_WIDTH,
  HABIT_CARD_BORDER_WIDTH as CARD_BORDER_WIDTH,
  HABIT_CARD_CHAIN_PADDING_LEFT as CARD_HORIZONTAL_PADDING,
  HABIT_CARD_CHAIN_PADDING_RIGHT as CARD_CHAIN_PADDING_RIGHT,
  HABITS_LIST_HORIZONTAL_PADDING,
  WEEK_STRIP_HORIZONTAL_PADDING,
} from '../../constants/weekStripLayout';
