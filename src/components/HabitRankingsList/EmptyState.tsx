/**
 * HabitRankingsList EmptyState
 */

import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <Ionicons color={colors.text.tertiary} name='list-outline' size={48} />
      <Text style={styles.emptyText}>No habits to rank yet</Text>
      <Text style={styles.emptySubtext}>
        Complete some habits to see your rankings
      </Text>
    </View>
  );
}
