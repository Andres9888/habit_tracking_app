/**
 * Tier names for character levels. Complements the numeric level with a
 * memorable rank, making progression feel meaningful beyond XP numbers.
 */
export function tierForLevel(level: number): string {
  if (level <= 0) return 'Spark';
  if (level <= 5) return 'Novice';
  if (level <= 15) return 'Adept';
  if (level <= 30) return 'Master';
  return 'Legend';
}
