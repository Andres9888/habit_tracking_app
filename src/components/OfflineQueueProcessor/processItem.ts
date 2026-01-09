import type {
  AffirmationPayload,
  HabitUpdatePayload,
  LetterPayload,
  QueuedSubmission,
  ReflectionPayload,
} from '../../hooks/useOfflineQueue';

interface Mutations {
  upsertReflection: (args: {
    habitId: never;
    date: string;
    emoji?: string;
    note?: string;
  }) => Promise<unknown>;
  createLetter: (args: {
    habitId: never;
    content: string;
    unlockDays: number;
    title?: string;
  }) => Promise<unknown>;
  createAffirmation: (args: {
    habitId: never;
    text: string;
    type?: string;
  }) => Promise<unknown>;
  updateHabit: (
    args: { habitId: never } & Record<string, unknown>
  ) => Promise<unknown>;
}

export async function processItem(
  item: QueuedSubmission,
  mutations: Mutations
): Promise<boolean> {
  try {
    switch (item.type) {
      case 'reflection': {
        const payload = item.payload as ReflectionPayload;
        await mutations.upsertReflection({
          date: payload.date,
          emoji: payload.emoji,
          habitId: payload.habitId as never,
          note: payload.note,
        });
        return true;
      }

      case 'letter': {
        const payload = item.payload as LetterPayload;
        await mutations.createLetter({
          content: payload.content,
          habitId: payload.habitId as never,
          title: payload.title,
          unlockDays: payload.unlockDays,
        });
        return true;
      }

      case 'affirmation': {
        const payload = item.payload as AffirmationPayload;
        await mutations.createAffirmation({
          habitId: payload.habitId as never,
          text: payload.text,
          type: payload.type,
        });
        return true;
      }

      case 'habitUpdate': {
        const payload = item.payload as HabitUpdatePayload;
        await mutations.updateHabit({
          habitId: payload.habitId as never,
          ...payload.updates,
        });
        return true;
      }

      case 'voiceNote':
      case 'visionBoardImage': {
        console.warn(
          `${item.type} offline sync not yet implemented - requires file re-upload`
        );
        return false;
      }

      default: {
        const _exhaustiveCheck: never = item.type;
        console.warn(`Unknown submission type: ${_exhaustiveCheck as string}`);
        return false;
      }
    }
  } catch (error) {
    console.warn(`Failed to process ${item.type}:`, error);
    throw error;
  }
}
