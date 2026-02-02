import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import { styles } from './MilestoneProgress.styles';
import { MILESTONES } from '../MilestoneProgressTypes';

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
        <Ionicons
          color='#9ca3af'
          name='arrow-forward-circle-outline'
          size={24}
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
