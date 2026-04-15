/**
 * Formats a popularity score as human-readable social proof text.
 * Scores >= 1000 become "X.Xk users" (e.g., 12400 → "12.4k users").
 */
export function formatPopularity(score: number): string {
  if (score >= 1000) {
    const thousands = Math.floor(score / 100) / 10;
    return `${thousands}k users`;
  }
  if (score > 0) {
    return `${score} users`;
  }
  return 'New';
}
