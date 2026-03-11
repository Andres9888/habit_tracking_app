/**
 * Formats a popularity score as human-readable social proof text.
 * Scores >= 1000 become "X.XK track this" (e.g., 1200 → "1.2K track this").
 */
export function formatPopularity(score: number): string {
  if (score >= 1000) {
    const thousands = Math.floor(score / 100) / 10;
    return `${thousands}K track this`;
  }
  if (score > 0) {
    return `${score} track this`;
  }
  return 'New';
}
