import type { Id } from '../../../../convex/_generated/dataModel';

export type MoodType = 'frustrated' | 'neutral' | 'happy' | 'fire';

export const MOOD_EMOJIS: Record<MoodType, string> = {
  frustrated: '😤',
  neutral: '😐',
  happy: '😊',
  fire: '🔥',
};

export const MOOD_LABELS: Record<MoodType, string> = {
  frustrated: 'Frustrated',
  neutral: 'Neutral',
  happy: 'Happy',
  fire: 'On Fire',
};

export interface JournalEntry {
  _id: Id<'journalEntries'>;
  _creationTime: number;
  createdAt: number;
  habitId: Id<'habits'>;
  mood: MoodType;
  textContent: string;
  updatedAt: number;
  userId?: string;
  whatWasHard?: string;
  whatWentWell?: string;
  whatWillChange?: string;
}

export interface JournalSectionProps {
  habitId: Id<'habits'>;
}
