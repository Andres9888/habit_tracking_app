/**
 * PremiumBenefitsRow — "Why members upgrade" card in the monetization flow.
 *
 * Renders the static list of benefits from {@link PREMIUM_BENEFITS} in a styled
 * card.  Memoised to avoid re-renders since the content is constant.
 */

import { memo } from 'react';
import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { PREMIUM_BENEFITS } from './constants';

function PremiumBenefitsRowComponent() {
  const { colors } = useThemeColors();

  return (
    <View className='gap-4 rounded-3xl border bg-white/90 p-5 shadow-[0px_16px_44px_rgba(120,90,50,0.06)]' style={{ borderColor: colors.status.warningLight }}>
      <Text className='text-[13px] font-medium uppercase tracking-[2px]' style={{ color: colors.status.warningText }}>
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
              style={{ color: colors.text.secondary }}
            >
              {benefit.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export const PremiumBenefitsRow = memo(PremiumBenefitsRowComponent);
