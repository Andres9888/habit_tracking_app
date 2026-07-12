/**
 * Curated progress-emoji theme presets (Sprout, Fire, Ranks, …).
 */
import {
  DEFAULT_PROGRESS_EMOJIS,
  type ProgressEmojiSet,
} from './progressEmojisCore';

export type { ProgressEmojiSet } from './progressEmojisCore';

export const SPROUT_PROGRESS_EMOJIS: ProgressEmojiSet = {
  starting: '🌱',
  building: '🌿',
  developing: '🪴',
  strong: '🌳',
  automatic: '🌲',
};

export const FIRE_PROGRESS_EMOJIS: ProgressEmojiSet = {
  starting: '✨',
  building: '🕯️',
  developing: '🔥',
  strong: '💥',
  automatic: '🌋',
};

const CHAIN_PROGRESS_EMOJIS: ProgressEmojiSet = {
  starting: '🪙',
  building: '🔗',
  developing: '⚙️',
  strong: '🥇',
  automatic: '💎',
};

export interface ProgressEmojiPreset {
  id: string;
  label: string;
  emojis: ProgressEmojiSet;
  /** Most recognizable emoji for theme chips. */
  chipEmoji?: string;
}

export const PROGRESS_EMOJI_PRESETS: ProgressEmojiPreset[] = [
  { id: 'plants', label: 'Sprout', emojis: SPROUT_PROGRESS_EMOJIS },
  { id: 'fire', label: 'Fire', emojis: FIRE_PROGRESS_EMOJIS, chipEmoji: '🔥' },
  {
    id: 'ranks',
    label: 'Ranks',
    emojis: DEFAULT_PROGRESS_EMOJIS,
    chipEmoji: '🏆',
  },
  {
    id: 'chain',
    label: 'Chain',
    emojis: CHAIN_PROGRESS_EMOJIS,
    chipEmoji: '🔗',
  },
  {
    id: 'fitness',
    label: 'Fitness',
    chipEmoji: '💪',
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
    chipEmoji: '🪐',
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
    chipEmoji: '🧠',
    emojis: {
      starting: '💭',
      building: '📖',
      developing: '🎓',
      strong: '🧠',
      automatic: '✨',
    },
  },
];
