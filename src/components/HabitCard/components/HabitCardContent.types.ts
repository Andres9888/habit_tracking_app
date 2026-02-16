import type { AnimatedStyle, SharedValue } from 'react-native-reanimated';
import type { AppTheme } from '../../../theme';
import type { CompletionIconType } from './StatusIndicator';

export interface HabitCardContentProps {
  name: string;
  icon: string;
  strength: number;
  currentStreak: number;
  bestStreak: number;
  completed: boolean;
  atRisk: boolean;
  theme: AppTheme;
  entranceContentStyle: AnimatedStyle;
  checkmarkAnimatedStyle: AnimatedStyle<{
    transform: ({ scale: number } | { rotate: string })[];
  }>;
  rippleAnimatedStyle: AnimatedStyle;
  /** Type of completion icon to display - T014 */
  completionIcon?: CompletionIconType;
  /** Whether there are pending offline operations - T014 */
  hasPendingOfflineOps?: boolean;
  /** Animated scale for chain link animation - T014 */
  chainScale?: SharedValue<number>;
  /** Animated rotation for chain link animation - T014 */
  chainRotate?: SharedValue<number>;
}
