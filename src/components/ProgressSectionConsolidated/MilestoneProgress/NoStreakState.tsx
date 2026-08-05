import React from 'react';
import { View, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { CircleArrowRight } from 'lucide-react-native';
import { styles } from './MilestoneProgress.styles';
import { MILESTONES } from '../MilestoneProgressTypes';
import type { AnimatedStyle } from 'react-native-reanimated';
import type { ViewStyle } from 'react-native';
import { iconSizes } from '@/theme/iconSizes';

interface NoStreakStateProps {
  accessibilityLabel: string;
  containerAnimatedStyle: AnimatedStyle<ViewStyle>;
}

export const NoStreakState = React.memo(function NoStreakState({
  accessibilityLabel,
  containerAnimatedStyle,
}: NoStreakStateProps) {
  return (
    <Animated.View
      accessibilityLabel={accessibilityLabel}
      accessibilityRole='text'
      style={[styles.container, containerAnimatedStyle]}
      testID='milestone-progress'
    >
      <View style={styles.noStreakContainer}>
        <CircleArrowRight
          color='#6B7280'
          size={iconSizes.large}
          style={styles.noStreakIcon}
        />
        <View style={styles.noStreakTextContainer}>
          <Text style={styles.noStreakTitle}>Start your streak today!</Text>
          <Text style={styles.noStreakSubtext}>
            3 days to unlock {MILESTONES[0].badge} {MILESTONES[0].name}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
});
