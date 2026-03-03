/**
 * Formats a popularity score for compact display.
 * Scores >= 1000 become "X.Xk" (e.g., 1200 → "1.2k").
 */
export function formatPopularity(score: number): string {
  if (score >= 1000) {
    const thousands = Math.floor(score / 100) / 10;
    return `${thousands}k`;
  }
  return String(score);
}
