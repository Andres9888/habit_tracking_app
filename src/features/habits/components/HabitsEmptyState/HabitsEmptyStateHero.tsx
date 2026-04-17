import React from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { styles } from './HabitsEmptyState.styles';

export function HabitsEmptyStateHero() {
  const { colors } = useThemeColors();
  return (
    <View style={styles.heroSection}>
      <View
        style={[styles.heroCircle, { backgroundColor: colors.primary[100] }]}
      >
        <Text style={styles.heroEmoji}>🔗</Text>
      </View>
      <Text style={[styles.heroTitle, { color: colors.text.primary }]}>
        Don&apos;t break the chain.
      </Text>
      <Text style={[styles.heroSubtitle, { color: colors.text.secondary }]}>
        Pick one habit. We&apos;ll grow it one link at a time.
      </Text>
    </View>
  );
}
