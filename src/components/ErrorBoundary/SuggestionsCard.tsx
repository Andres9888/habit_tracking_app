/**
 * SuggestionsCard Component
 * Displays troubleshooting suggestions in the error fallback.
 * Theme-aware via useErrorTheme (works outside ThemeColorProvider).
 */

import { StyleSheet, Text, View } from 'react-native';

import { useErrorTheme } from './useErrorTheme';

export function SuggestionsCard() {
  const { colors } = useErrorTheme();

  return (
    <View style={[styles.card, {
      backgroundColor: colors.card,
      borderColor: colors.cardBorder,
    }]}>
      <Text style={[styles.title, { color: colors.text.primary }]}>
        Things to try:
      </Text>
      <Text style={[styles.item, { color: colors.text.secondary }]}>
        {'\u2022'} Close and reopen the app
      </Text>
      <Text style={[styles.item, { color: colors.text.secondary }]}>
        {'\u2022'} Check your internet connection
      </Text>
      <Text style={[styles.item, { color: colors.text.secondary }]}>
        {'\u2022'} Make sure the app is up to date
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    maxWidth: 280,
    padding: 16,
    width: '100%',
  },
  item: {
    fontSize: 13,
    lineHeight: 20,
  },
  title: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
});
