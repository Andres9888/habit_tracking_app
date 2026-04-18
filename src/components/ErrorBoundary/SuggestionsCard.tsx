/**
 * SuggestionsCard Component
 * Displays troubleshooting suggestions in the error fallback.
 */

import { StyleSheet, Text, View } from 'react-native';

import { useThemeColors } from '../../theme/ThemeContext';
import { borderRadius } from '@/theme/spacing';
import { fontWeights, typography } from '@/theme/typography';

export function SuggestionsCard() {
  const { colors } = useThemeColors();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.card,
      borderColor: colors.cardBorder,
      borderRadius: borderRadius.medium,
      borderWidth: 1,
      marginBottom: 24,
      maxWidth: 280,
      padding: 16,
      width: '100%',
    },
    item: {
      ...typography.caption,
      color: colors.text.secondary,
      lineHeight: 20,
    },
    title: {
      ...typography.caption,
      color: colors.text.primary,
      fontWeight: fontWeights.semibold,
      marginBottom: 8,
    },
  });

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Things to try:</Text>
      <Text style={styles.item}>{'\u2022'} Close and reopen the app</Text>
      <Text style={styles.item}>{'\u2022'} Check your internet connection</Text>
      <Text style={styles.item}>
        {'\u2022'} Make sure the app is up to date
      </Text>
    </View>
  );
}
