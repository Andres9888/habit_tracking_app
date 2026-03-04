import type { ColorScheme, MotivationalMessage } from './types';
import { colors } from '@/theme/colors';

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
    return {
      accent: colors.primary[500],
      bg: colors.strength.buildingLight,
      text: colors.primary[700],
    };
  if (completionRate >= 75)
    return {
      accent: colors.secondary[500],
      bg: colors.secondary[100],
      text: '#1d4ed8',
    };
  if (completionRate >= 50)
    return { accent: '#f59e0b', bg: colors.warningLight, text: '#b45309' };
  return {
    accent: colors.gray[400],
    bg: colors.gray[50],
    text: colors.gray[600],
  };
}
