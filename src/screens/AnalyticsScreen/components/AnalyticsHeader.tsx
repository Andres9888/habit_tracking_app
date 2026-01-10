/**
 * AnalyticsHeader - Screen header with title and subtitle
 */
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';

export const AnalyticsHeader: React.FC = () => {
  return (
    <View
      accessible
      accessibilityLabel='Analytics Screen'
      accessibilityRole='header'
      style={styles.header}
    >
      <Text
        accessibilityLabel='Analytics'
        accessibilityRole='text'
        style={styles.headerTitle}
      >
        Analytics
      </Text>
      <Text
        accessibilityLabel='Track your habit journey'
        accessibilityRole='text'
        style={styles.headerSubtitle}
      >
        Track your habit journey
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingBottom: spacing.md,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },
  headerSubtitle: {
    ...typography.body,
    color: colors.text.secondary,
    marginTop: spacing.xs,
  },
  headerTitle: {
    ...typography.h1,
    color: colors.text.primary,
  },
});
