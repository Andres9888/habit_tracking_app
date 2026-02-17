import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getProgressStyles } from './styles/progress.styles';
import { MILESTONES } from '../MilestoneProgressTypes';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';

interface NoStreakStateProps {
  accessibilityLabel: string;
  containerAnimatedStyle: AnimatedStyle<ViewStyle>;
}

export const NoStreakState = React.memo(function NoStreakState({
  accessibilityLabel,
  containerAnimatedStyle,
}: NoStreakStateProps) {
  const { colors } = useThemeColors();
  const styles = getProgressStyles(colors);

  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='text'
      style={[styles.container, containerAnimatedStyle]}
      testID='milestone-progress'
    >
      <View style={styles.noStreakContainer}>
        <Ionicons
          color={colors.text.secondary}
          name='arrow-forward-circle-outline'
          size={24}
          style={styles.noStreakIcon}
        />
        <View style={styles.noStreakTextContainer}>
          <Text style={[styles.noStreakTitle, { color: colors.text.primary }]}>
            Start your streak today!
          </Text>
          <Text style={[styles.noStreakSubtext, { color: colors.text.secondary }]}>
            3 days to unlock {MILESTONES[0].badge} {MILESTONES[0].name}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
});
