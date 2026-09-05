/**
 * Undo-delete payload.
 *
 * `remove` hard-deletes the habit and everything hanging off it, keeping only
 * this JSON blob in `deletedHabits` for the undo window. Anything missing here
 * is gone for good once the user hits undo. The habit half used to be a
 * hand-maintained field list that had drifted from the schema (progressEmojis,
 * strengthAlgorithm, archived, accessibility, totals and the science params all
 * vanished on undo), so it is now derived from the document type itself and
 * cannot drift again.
 *
 * The joined `templateUsage` rows are captured too: `habits.get` reads them to
 * show the template "why" and start-small copy, which disappeared after undo.
 */
import type { Doc, Id } from '../_generated/dataModel';

type HabitDoc = Doc<'habits'>;

/**
 * Fields deliberately not carried across a delete/restore round trip:
 * - system fields and `userId` are re-derived from the caller's identity
 * - `order` is recomputed so the restored habit lands at the end of the list
 * - `strengthUpdatedAt` is stamped fresh on restore
 * - the pendingStrengthRecalc pair points at a scheduled function that no
 *   longer exists once the habit is gone
 * - `clientRequestId` is a create-idempotency key; resurrecting it would let a
 *   retried create collide with the restored habit
 */
type ExcludedHabitKey =
  | '_creationTime'
  | '_id'
  | 'clientRequestId'
  | 'order'
  | 'pendingStrengthRecalcId'
  | 'pendingStrengthRecalcRequestedAt'
  | 'strengthUpdatedAt'
  | 'userId';

export interface RemovedHabitPayload {
  habit: Omit<HabitDoc, ExcludedHabitKey>;
  tracking: Array<{ completed: boolean; date: string }>;
  dayNotes: Array<{ date: string; note: string }>;
  templateUsage: Array<{ importedAt: number; templateId: Id<'templates'> }>;
}

export function buildRemovedHabitPayload(
  habit: HabitDoc,
  trackingEntries: Array<Pick<Doc<'tracking'>, 'completed' | 'date'>>,
  dayNotes: Array<Pick<Doc<'habitDayNotes'>, 'date' | 'note'>>,
  templateUsageEntries: Array<
    Pick<Doc<'templateUsage'>, 'importedAt' | 'templateId'>
  >
): RemovedHabitPayload {
  const {
    _creationTime: _unusedCreationTime,
    _id: _unusedId,
    clientRequestId: _unusedClientRequestId,
    order: _unusedOrder,
    pendingStrengthRecalcId: _unusedRecalcId,
    pendingStrengthRecalcRequestedAt: _unusedRecalcAt,
    strengthUpdatedAt: _unusedStrengthUpdatedAt,
    userId: _unusedUserId,
    ...habitFields
  } = habit;

  return {
    dayNotes: dayNotes.map(({ date, note }) => ({ date, note })),
    habit: habitFields,
    templateUsage: templateUsageEntries.map(({ importedAt, templateId }) => ({
      importedAt,
      templateId,
    })),
    tracking: trackingEntries.map(({ completed, date }) => ({
      completed,
      date,
    })),
  };
}
