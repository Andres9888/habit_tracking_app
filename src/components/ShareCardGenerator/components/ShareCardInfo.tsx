import React from 'react';
import { View, Text } from 'react-native';
import { shareCardContentStyles as styles } from '../styles';

interface ShareCardInfoProps {
  habitName: string;
  milestoneLabel: string;
  streakCount: number;
  motivationalMessage: string;
}

export function ShareCardInfo({
  habitName,
  milestoneLabel,
  streakCount,
  motivationalMessage,
}: ShareCardInfoProps) {
  return (
    <View style={styles.infoContainer}>
      <Text style={styles.habitName}>{habitName}</Text>

      <View style={styles.milestoneRow}>
        <Text style={styles.milestoneLabel}>{milestoneLabel}</Text>
      </View>

      <Text style={styles.streakCount}>{streakCount} Day Streak</Text>

      <Text style={styles.personalMessage}>{motivationalMessage}</Text>
    </View>
  );
}
