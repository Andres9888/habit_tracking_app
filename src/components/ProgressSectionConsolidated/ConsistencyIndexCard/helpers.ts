/**
 * Helper functions for ConsistencyIndexCard
 */

/**
 * Get color based on consistency score
 */
export function getScoreColor(score: number, successColor?: string): string {
  if (score >= 80) return successColor ?? '#10b981';
  if (score >= 60) return '#8b5cf6'; // violet-500 - good
  if (score >= 40) return '#f59e0b'; // amber-500 - moderate
  return '#ef4444'; // red-500 - needs work
}

/**
 * Get feedback message based on consistency score
 */
export function getFeedbackMessage(score: number): string {
  if (score >= 80) return 'Excellent consistency! Keep it up.';
  if (score >= 60) return "Good progress! You're building a solid habit.";
  if (score >= 40) return 'Making progress. Try to increase frequency.';
  return 'Room to grow. Every day counts!';
}
