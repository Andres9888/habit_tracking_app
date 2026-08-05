/**
 * StatusIndicator Component
 * Displays completion indicator (chain link or checkmark) or at-risk warning
 *
 * @see docs/offline-habit-sync.md T014 - Chain animation for offline completions
 */

import React, { memo } from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import Animated, {
  type AnimatedStyle,
  type SharedValue,
} from 'react-native-reanimated';
import { useAppTheme } from '../../../theme';
import { iconSizes } from '../../../theme/iconSizes';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../HabitCard.styles';
import { ChainLinkAnimation } from './ChainLinkAnimation';

/** Completion icon type - chain link for visual "chain building" or checkbox */
export type CompletionIconType = 'chain' | 'checkbox';

interface StatusIndicatorProps {
  completed: boolean;
  atRisk: boolean;
  checkmarkAnimatedStyle: AnimatedStyle<{
    transform: ({ scale: number } | { rotate: string })[];
  }>;
  /** Type of completion icon to display */
  completionIcon?: CompletionIconType;
  /** Whether there are pending offline operations */
  hasPendingOfflineOps?: boolean;
  /** Animated scale value for chain link animation */
  chainScale?: SharedValue<number>;
  /** Animated rotation value for chain link animation */
  chainRotate?: SharedValue<number>;
}

export const StatusIndicator = memo(function StatusIndicator({
  completed,
  atRisk,
  checkmarkAnimatedStyle,
  completionIcon = 'checkbox',
  hasPendingOfflineOps = false,
  chainScale,
  chainRotate,
}: StatusIndicatorProps) {
  const theme = useAppTheme();
  const { colors: themeColors } = useThemeColors();

  if (completed) {
    // Chain link animation for chain icon type
    if (completionIcon === 'chain' && chainScale && chainRotate) {
      return (
        <View
          style={[
            styles.checkmark,
            { backgroundColor: theme.custom.colors.success },
          ]}
        >
          <ChainLinkAnimation
            hasPendingOfflineOps={hasPendingOfflineOps}
            rotate={chainRotate}
            scale={chainScale}
            size={iconSizes.medium}
          />
        </View>
      );
    }

    // Default checkmark animation
    return (
      <Animated.View
        style={[
          styles.checkmark,
          { backgroundColor: theme.custom.colors.success },
          checkmarkAnimatedStyle as AnimatedStyle<ViewStyle>,
        ]}
      >
        <Text style={styles.checkmarkText}>✓</Text>
      </Animated.View>
    );
  }

  if (atRisk) {
    return (
      <View
        style={[
          styles.warningBadge,
          { backgroundColor: theme.custom.colors.warning[500] },
        ]}
      >
        <Text style={styles.warningText}>⚠️</Text>
      </View>
    );
  }

  // Show empty circle for uncompleted state — provides a visible toggle target
  // and meets 44x44px minimum touch target requirement
  return (
    <View
      style={[
        styles.checkCircle,
        styles.checkCircleUnchecked,
        { borderColor: themeColors.border },
      ]}
    />
  );
});
