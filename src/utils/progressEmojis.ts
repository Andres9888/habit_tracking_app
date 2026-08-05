/**
 * Progress growth emoji defaults, resolution, and curated presets.
 *
 * Resolution order: per-habit override → user-wide default → built-in defaults.
 */

import {
  CUSTOM_PRESET_ID,
  DEFAULT_PROGRESS_EMOJIS,
  PROGRESS_EMOJI_PRESETS,
  STRENGTH_LEVEL_KEYS,
} from './progressEmojiPresets';
import type {
  PartialProgressEmojiSet,
  ProgressEmojiSet,
} from './progressEmojiPresets';
export * from './progressEmojiPresets';

export function resolveProgressEmojis(
  habitOverride?: PartialProgressEmojiSet,
  userDefault?: PartialProgressEmojiSet
): ProgressEmojiSet {
  return { ...DEFAULT_PROGRESS_EMOJIS, ...userDefault, ...habitOverride };
}

export function matchPresetId(
  set: ProgressEmojiSet,
  customEmojis?: ProgressEmojiSet
): string | null {
  for (const preset of PROGRESS_EMOJI_PRESETS) {
    if (STRENGTH_LEVEL_KEYS.every((k) => preset.emojis[k] === set[k])) {
      return preset.id;
    }
  }
  if (
    customEmojis &&
    STRENGTH_LEVEL_KEYS.every((k) => customEmojis[k] === set[k])
  ) {
    return CUSTOM_PRESET_ID;
  }
  return null;
}
