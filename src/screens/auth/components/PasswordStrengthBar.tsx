/**
 * PasswordStrengthBar - Visual feedback for password strength
 * Shows a colored bar + label that updates as the user types.
 */

import { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { colors } from '../../../theme/colors';

interface PasswordStrengthBarProps {
  password: string;
}

type Strength = 'weak' | 'fair' | 'good' | 'strong';

function useStrengthConfig() {
  const { colors: themeColors } = useThemeColors();
  
  return {
    weak: { color: '#ef4444', label: 'Weak', width: '25%' as const },
    fair: { color: '#f59e0b', label: 'Fair', width: '50%' as const },
    good: { color: themeColors.primary[500], label: 'Good', width: '75%' as const },
    strong: { color: themeColors.primary[700], label: 'Strong', width: '100%' as const },
  };
}

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
  const { colors: themeColors } = useThemeColors();
  const strengthConfig = useStrengthConfig();
  const strength = useMemo(() => getStrength(password), [password]);
  const config = strengthConfig[strength];

  const dynamicStyles = StyleSheet.create({
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
      fontSize: 13,
      fontWeight: '600',
    },
    track: {
      backgroundColor: themeColors.gray[200],
      borderRadius: 2,
      flex: 1,
      height: 4,
      overflow: 'hidden',
    },
  });

  if (!password) return null;

  return (
    <Animated.View entering={FadeInDown.duration(280).springify().damping(18)} style={dynamicStyles.container}>
      <View style={dynamicStyles.track}>
        <View
          style={[
            dynamicStyles.fill,
            { backgroundColor: config.color, width: config.width },
          ]}
        />
      </View>
      <Text
        accessibilityLabel={`Password strength: ${config.label}`}
        style={[dynamicStyles.label, { color: config.color }]}
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
    fontSize: 13,
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
