/**
 * Mindfulness Timer Utilities
 *
 * Detects whether a habit is a mindfulness/meditation/breathing habit
 * based on its name and icon, and provides timer-related constants.
 */

/** Keywords that indicate a mindfulness-type habit */
const MINDFULNESS_KEYWORDS = [
  'meditat',
  'mindful',
  'breath',
  'breathing',
  'zen',
  'calm',
  'yoga',
  'pranayama',
  'deep breath',
  'box breath',
  'relaxation',
  'stillness',
  'quiet time',
  'sit in silence',
];

/** Emoji icons commonly associated with mindfulness */
const MINDFULNESS_ICONS = [
  '🧘',
  '🧘‍♀️',
  '🧘‍♂️',
  '🕉️',
  '☮️',
  '🙏',
  '💆',
  '💆‍♀️',
  '💆‍♂️',
  '🌬️',
  '😮‍💨',
  '🫁',
  '🪷',
  '☯️',
];

/** Preset timer durations in minutes */
export const TIMER_PRESETS = [1, 3, 5, 10, 15] as const;

/** Breathing cycle phases in seconds */
export const BREATHING_CYCLE = {
  inhale: 4,
  hold: 4,
  exhale: 4,
} as const;

export const BREATHING_TOTAL =
  BREATHING_CYCLE.inhale + BREATHING_CYCLE.hold + BREATHING_CYCLE.exhale;

export type BreathingPhase = 'inhale' | 'hold' | 'exhale';

/**
 * Determines if a habit is a mindfulness habit based on name and icon.
 */
export function isMindfulnessHabit(name: string, icon?: string): boolean {
  const lowerName = name.toLowerCase();
  const nameMatch = MINDFULNESS_KEYWORDS.some((kw) => lowerName.includes(kw));
  const iconMatch = icon ? MINDFULNESS_ICONS.includes(icon) : false;
  return nameMatch || iconMatch;
}
