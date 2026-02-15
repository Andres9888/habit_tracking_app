/**
 * PremiumBenefitsRow Component
 * Displays list of premium benefits
 */

import { Text, View, StyleSheet } from 'react-native';
import { PREMIUM_BENEFITS } from './constants';
import { useThemeColors } from '@/theme/ThemeContext';

export function PremiumBenefitsRow() {
  const { colors } = useThemeColors();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: `${colors.surface}E6`,
          borderColor: '#fef3c766',
        },
      ]}
    >
      <Text style={styles.label}>
        Why members upgrade
      </Text>
      <View className='gap-3'>
        {PREMIUM_BENEFITS.map((benefit) => (
          <View key={benefit.title} className='gap-1'>
            <Text style={[styles.title, { color: colors.text.primary }]}>
              {benefit.title}
            </Text>
            <Text
              style={[styles.description, { color: colors.text.secondary }]}
            >
              {benefit.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 24,
    borderWidth: 1,
    gap: 16,
    padding: 20,
    shadowColor: '#785A32',
    shadowOffset: { height: 16, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 44,
  },
  description: {
    fontSize: 13,
    fontWeight: '400',
    lineHeight: 18,
  },
  label: {
    color: '#b45309',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 17,
    fontWeight: '600',
  },
});
