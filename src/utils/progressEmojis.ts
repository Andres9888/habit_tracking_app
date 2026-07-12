/**
 * Progress growth emoji defaults, resolution, and curated presets.
 * Barrel re-export — implementations live in focused modules.
 */

export {
  STRENGTH_LEVEL_KEYS,
  DEFAULT_PROGRESS_EMOJIS,
  resolveProgressEmojis,
  CUSTOM_PRESET_ID,
  type StrengthLevelKey,
  type ProgressEmojiSet,
  type PartialProgressEmojiSet,
} from './progressEmojisCore';

export {
  SPROUT_PROGRESS_EMOJIS,
  FIRE_PROGRESS_EMOJIS,
  PROGRESS_EMOJI_PRESETS,
  type ProgressEmojiPreset,
} from './progressEmojiPresets';

import {
  CUSTOM_PRESET_ID,
  STRENGTH_LEVEL_KEYS,
  type ProgressEmojiSet,
} from './progressEmojisCore';
import { PROGRESS_EMOJI_PRESETS } from './progressEmojiPresets';

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
