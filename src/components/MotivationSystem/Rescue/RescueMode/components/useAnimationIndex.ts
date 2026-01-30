/**
 * useAnimationIndex - Helper for calculating cumulative animation indices
 */

interface AnimationFlags {
  hasStreak: boolean;
  hasWhy: boolean;
  hasVoiceNote: boolean;
  hasPreviousStreakNotes?: boolean;
}

export function getAnimationIndex(
  flags: AnimationFlags,
  includePrevious: ('streak' | 'why' | 'voiceNote' | 'previousStreak')[] = []
): number {
  let index = 0;
  if (includePrevious.includes('streak') && flags.hasStreak) index++;
  if (includePrevious.includes('why') && flags.hasWhy) index++;
  if (includePrevious.includes('voiceNote') && flags.hasVoiceNote) index++;
  if (
    includePrevious.includes('previousStreak') &&
    flags.hasPreviousStreakNotes
  )
    index++;
  return index;
}
