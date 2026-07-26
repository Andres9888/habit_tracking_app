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

export interface ProgressEmojiPreset {
  id: string;
  label: string;
  emojis: ProgressEmojiSet;
}

export const PROGRESS_EMOJI_PRESETS: ProgressEmojiPreset[] = [
  { id: 'ranks', label: 'Ranks', emojis: DEFAULT_PROGRESS_EMOJIS },
  {
    id: 'chain',
    label: 'Chain',
    emojis: {
      starting: '🪙',
      building: '🔗',
      developing: '⚙️',
      strong: '🥇',
      automatic: '💎',
    },
  },
  {
    id: 'plants',
    label: 'Plants',
    emojis: {
      starting: '🌱',
      building: '🌿',
      developing: '🌳',
      strong: '💪',
      automatic: '⚡',
    },
  },
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

export const CUSTOM_PRESET_ID = 'custom';
