import type { EmojiOption } from './QuickReflection.types';

export const EMOJI_OPTIONS: EmojiOption[] = [
  { emoji: '😤', label: 'Frustrated', type: 'frustrated' },
  { emoji: '😐', label: 'Neutral', type: 'neutral' },
  { emoji: '😊', label: 'Happy', type: 'happy' },
  { emoji: '🔥', label: 'On Fire', type: 'fire' },
];

export const SPRING_BOUNCY = {
  damping: 8,
  stiffness: 300,
};
