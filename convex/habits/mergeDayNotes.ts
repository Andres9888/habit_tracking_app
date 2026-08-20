export type DayNote = { date: string; note: string };

export function mergeDayNotes(
  stored: DayNote[],
  tracking: Array<{ date: string; note?: string }>
): DayNote[] {
  const byDate = new Map<string, string>();
  for (const row of tracking) {
    const text = row.note?.trim();
    if (text) byDate.set(row.date, text);
  }
  for (const row of stored) {
    if (row.note) byDate.set(row.date, row.note);
  }
  return [...byDate.entries()]
    .map(([date, note]) => ({ date, note }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
