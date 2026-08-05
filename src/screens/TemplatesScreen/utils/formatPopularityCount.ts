/** Formats a popularity score for compact display (e.g. 1200 → "1.2k"). */
export function formatPopularityCount(
  score: number | null | undefined
): string | null {
  if (!score || score < 1) return null;
  if (score >= 1000) {
    const k = score / 1000;
    return `${k % 1 === 0 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return `${score}`;
}
