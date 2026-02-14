/**
 * PremiumBenefitsRow Component
 * Displays list of premium benefits with dark mode support
 */

import { Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { PREMIUM_BENEFITS } from './constants';

export function PremiumBenefitsRow() {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      className='gap-4 rounded-3xl border p-5'
      style={{
        backgroundColor: isDark ? colors.card : 'rgba(255, 255, 255, 0.9)',
        borderColor: isDark ? colors.cardBorder : 'rgba(251, 191, 36, 0.15)',
        elevation: 2,
        shadowColor: isDark ? '#000000' : 'rgba(120, 90, 50, 0.06)',
        shadowOffset: { height: 16, width: 0 },
        shadowOpacity: 1,
        shadowRadius: 44,
      }}
    >
      <Text
        className='text-[13px] font-medium uppercase tracking-[2px]'
        style={{ color: isDark ? '#fbbf24' : '#b45309' }}
      >
        Why members upgrade
      </Text>
      <View className='gap-3'>
        {PREMIUM_BENEFITS.map((benefit) => (
          <View key={benefit.title} className='gap-1'>
            <Text
              className='text-[17px] font-semibold'
              style={{ color: colors.text.primary }}
            >
              {benefit.title}
            </Text>
            <Text
              className='text-[13px] font-normal leading-[18px]'
              style={{ color: colors.text.tertiary }}
            >
              {benefit.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
