/**
 * Progress growth emoji types, defaults, and resolution.
 */

export const STRENGTH_LEVEL_KEYS = [
  'starting',
  'building',
  'developing',
  'strong',
  'automatic',
] as const;

export type StrengthLevelKey = (typeof STRENGTH_LEVEL_KEYS)[number];
export type ProgressEmojiSet = Record<StrengthLevelKey, string>;
export type PartialProgressEmojiSet = Partial<ProgressEmojiSet>;

export const DEFAULT_PROGRESS_EMOJIS: ProgressEmojiSet = {
  starting: '🥉',
  building: '🥈',
  developing: '🥇',
  strong: '🏆',
  automatic: '💎',
};

export function resolveProgressEmojis(
  habitOverride?: PartialProgressEmojiSet,
  userDefault?: PartialProgressEmojiSet
): ProgressEmojiSet {
  return { ...DEFAULT_PROGRESS_EMOJIS, ...userDefault, ...habitOverride };
}

export const CUSTOM_PRESET_ID = 'custom';
