/** Minimum weekly imports before showing social proof on cards. */
export const WEEKLY_IMPORT_THRESHOLD = 5;

export function formatWeeklyImports(count: number | undefined): string | null {
  if (!count || count < WEEKLY_IMPORT_THRESHOLD) return null;
  return `${count} added this week`;
}
