/**
 * PasswordStrengthBar - Visual feedback for password strength
 * Shows a colored bar + label that updates as the user types.
 */

import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';

interface PasswordStrengthBarProps {
  password: string;
}

type Strength = 'weak' | 'fair' | 'good' | 'strong';

const STRENGTH_CONFIG: Record<
  Strength,
  { color: string; label: string; width: `${number}%` }
> = {
  weak: { color: '#ef4444', label: 'Weak', width: '25%' },
  fair: { color: '#f59e0b', label: 'Fair', width: '50%' },
  good: { color: '#22c55e', label: 'Good', width: '75%' },
  strong: { color: '#047857', label: 'Strong', width: '100%' },
};

function getStrength(password: string): Strength {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 1) return 'weak';
  if (score <= 2) return 'fair';
  if (score <= 3) return 'good';
  return 'strong';
}

export function PasswordStrengthBar({ password }: PasswordStrengthBarProps) {
  const strength = useMemo(() => getStrength(password), [password]);
  const config = STRENGTH_CONFIG[strength];

  if (!password) return null;

  return (
    <Animated.View entering={FadeIn.duration(200)} style={styles.container}>
      <View style={styles.track}>
        <View
          style={[
            styles.fill,
            { backgroundColor: config.color, width: config.width },
          ]}
        />
      </View>
      <Text
        accessibilityLabel={`Password strength: ${config.label}`}
        style={[styles.label, { color: config.color }]}
      >
        {config.label}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginTop: 6,
  },
  fill: {
    borderRadius: 2,
    height: '100%',
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
  },
  track: {
    backgroundColor: '#e7e5e4',
    borderRadius: 2,
    flex: 1,
    height: 4,
    overflow: 'hidden',
  },
});
