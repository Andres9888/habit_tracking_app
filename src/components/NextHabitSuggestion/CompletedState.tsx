import React from 'react';
import { View, Text } from 'react-native';
import { styles } from './NextHabitSuggestion.styles';

interface CompletedStateProps {
  totalCount: number;
}

export function CompletedState({ totalCount }: CompletedStateProps) {
  return (
    <View style={styles.completedContainer}>
      <Text style={styles.completedEmoji}>🎉</Text>
      <Text style={styles.completedTitle}>All done for today!</Text>
      <Text style={styles.completedSubtitle}>
        {totalCount} habit{totalCount === 1 ? '' : 's'} completed
      </Text>
    </View>
  );
}
