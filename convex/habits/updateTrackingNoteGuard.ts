/** Pure guard for updateTrackingNote — kept testable without Convex runtime. */
export function updateTrackingNoteGuard(row: {
  completed: boolean;
  exists: boolean;
}): string | null {
  if (!row.exists || !row.completed) {
    return 'Complete the day before adding a note';
  }
  return null;
}
