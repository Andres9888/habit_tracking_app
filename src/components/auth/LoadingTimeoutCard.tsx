/**
 * LoadingTimeoutCard Component
 * Error card shown when auth loading exceeds timeout.
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors } from '../../theme/colors';

interface LoadingTimeoutCardProps {
  onRetry: () => void;
}

export function LoadingTimeoutCard({ onRetry }: LoadingTimeoutCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Taking longer than expected</Text>
      <Text style={styles.description}>
        We&apos;re having trouble connecting. Check your internet connection and
        try again.
      </Text>
      <Pressable
        accessibilityLabel='Try Again'
        accessibilityRole='button'
        style={styles.button}
        onPress={onRetry}
      >
        <Text style={styles.buttonText}>Try Again</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary[600],
    borderRadius: 12,
    paddingHorizontal: 32,
    paddingVertical: 12,
  },
  buttonText: {
    color: colors.text.inverse,
    fontSize: 16,
    fontWeight: '600',
  },
  card: {
    alignItems: 'center',
    backgroundColor: colors.light.card,
    borderColor: colors.border,
    borderRadius: 16,
    borderWidth: 1,
    marginHorizontal: 24,
    marginTop: 8,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
  },
  description: {
    color: colors.text.secondary,
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 20,
    textAlign: 'center',
  },
  title: {
    color: colors.text.primary,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
});
