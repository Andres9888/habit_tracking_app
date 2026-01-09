import type { ColorScheme, MotivationalMessage } from './types';

/**
 * Get motivational message based on completion rate
 */
export function getMotivationalMessage(
  completionRate: number
): MotivationalMessage {
  if (completionRate >= 90)
    return { text: 'Outstanding week! 🌟', type: 'excellent' };
  if (completionRate >= 75)
    return { text: 'Great momentum! 💪', type: 'great' };
  if (completionRate >= 50) return { text: 'Solid progress! 👍', type: 'good' };
  if (completionRate >= 25)
    return { text: 'Building habits! 🌱', type: 'building' };
  return { text: 'Every step counts! 🚀', type: 'starting' };
}

/**
 * Get color scheme based on completion rate
 */
export function getColorScheme(completionRate: number): ColorScheme {
  if (completionRate >= 90)
    return { accent: '#10b981', bg: '#dcfce7', text: '#047857' };
  if (completionRate >= 75)
    return { accent: '#3b82f6', bg: '#dbeafe', text: '#1d4ed8' };
  if (completionRate >= 50)
    return { accent: '#f59e0b', bg: '#fef3c7', text: '#b45309' };
  return { accent: '#78716c', bg: '#f5f5f4', text: '#57534e' };
}
