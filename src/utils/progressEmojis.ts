/**
 * Progress growth emoji defaults, resolution, and curated presets.
 *
 * Resolution order: per-habit override → user-wide default → built-in defaults.
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

const CHAIN_PROGRESS_EMOJIS: ProgressEmojiSet = {
  starting: '🪙',
  building: '🔗',
  developing: '⚙️',
  strong: '🥇',
  automatic: '💎',
};

const PLANTS_PROGRESS_EMOJIS: ProgressEmojiSet = {
  starting: '🌱',
  building: '🌿',
  developing: '🌳',
  strong: '💪',
  automatic: '⚡',
};

export interface ProgressEmojiPreset {
  id: string;
  label: string;
  emojis: ProgressEmojiSet;
}

export const PROGRESS_EMOJI_PRESETS: ProgressEmojiPreset[] = [
  { id: 'ranks', label: 'Ranks', emojis: DEFAULT_PROGRESS_EMOJIS },
  { id: 'chain', label: 'Chain', emojis: CHAIN_PROGRESS_EMOJIS },
  { id: 'plants', label: 'Plants', emojis: PLANTS_PROGRESS_EMOJIS },
  {
    id: 'fitness',
    label: 'Fitness',
    emojis: {
      starting: '💧',
      building: '🏃',
      developing: '🏋️',
      strong: '💪',
      automatic: '🏆',
    },
  },
  {
    id: 'space',
    label: 'Space',
    emojis: {
      starting: '🌑',
      building: '🌓',
      developing: '🌕',
      strong: '🪐',
      automatic: '🌌',
    },
  },
  {
    id: 'mind',
    label: 'Mind',
    emojis: {
      starting: '💭',
      building: '📖',
      developing: '🎓',
      strong: '🧠',
      automatic: '✨',
    },
  },
  {
    id: 'fire',
    label: 'Fire',
    emojis: {
      starting: '🪵',
      building: '🔥',
      developing: '🌋',
      strong: '⚡',
      automatic: '👑',
    },
  },
];

export function resolveProgressEmojis(
  habitOverride?: PartialProgressEmojiSet,
  userDefault?: PartialProgressEmojiSet
): ProgressEmojiSet {
  return { ...DEFAULT_PROGRESS_EMOJIS, ...userDefault, ...habitOverride };
}

export const CUSTOM_PRESET_ID = 'custom';

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
