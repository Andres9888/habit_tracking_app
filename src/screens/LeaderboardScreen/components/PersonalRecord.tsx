/**
 * PersonalRecord - Display personal best achievements
 */

import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { styles } from '../LeaderboardScreen.styles';

interface PersonalRecordProps {
  title: string;
  habitName: string;
  value: string;
  icon: string;
  delay?: number;
}

export function PersonalRecord({
  title,
  habitName,
  value,
  icon,
  delay = 0,
}: PersonalRecordProps) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={styles.recordCard}
    >
      <Text style={styles.recordTitle}>{icon} {title}</Text>
      <Text style={styles.recordHabitName}>{habitName}</Text>
      <Text style={styles.recordValue}>{value}</Text>
    </Animated.View>
  );
}
