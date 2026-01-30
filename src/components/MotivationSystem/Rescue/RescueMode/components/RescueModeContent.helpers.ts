import type { RescueModeContentProps } from './RescueModeContent.types';

export type ContentFlags = {
  hasPreviousStreakNotes: boolean;
  hasStreak: boolean;
  hasVoiceNote: boolean;
  hasWhy: boolean;
};

export function getContentFlags(props: RescueModeContentProps): ContentFlags {
  return {
    hasPreviousStreakNotes: props.hasPreviousStreakNotes,
    hasStreak: props.hasStreak,
    hasVoiceNote: props.hasVoiceNote,
    hasWhy: props.hasWhy,
  };
}
