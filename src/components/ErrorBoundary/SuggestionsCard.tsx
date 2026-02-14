/**
 * SuggestionsCard Component
 * Displays troubleshooting suggestions in the error fallback.
 */

import { StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';

export function SuggestionsCard() {
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

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.light.card,
    borderColor: colors.border,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    maxWidth: 280,
    padding: 16,
    width: '100%',
  },
  item: {
    color: colors.text.secondary,
    fontSize: 13,
    lineHeight: 20,
  },
  title: {
    color: colors.text.primary,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
});
