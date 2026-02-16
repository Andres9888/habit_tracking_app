/**
 * PremiumBenefitsRow — "Why members upgrade" card in the monetization flow.
 *
 * Renders the static list of benefits from {@link PREMIUM_BENEFITS} in a styled
 * card.  Memoised to avoid re-renders since the content is constant.
 */

import { memo } from 'react';
import { Text, View } from 'react-native';
import { PREMIUM_BENEFITS } from './constants';

function PremiumBenefitsRowComponent() {
  return (
    <View className='gap-4 rounded-3xl border border-amber-100/60 bg-white/90 p-5 shadow-[0px_16px_44px_rgba(120,90,50,0.06)]'>
      <Text className='text-[13px] font-medium uppercase tracking-[2px] text-amber-700'>
        Why members upgrade
      </Text>
      <View className='gap-3'>
        {PREMIUM_BENEFITS.map((benefit) => (
          <View key={benefit.title} className='gap-1'>
            <Text className='text-[17px] font-semibold text-stone-800'>
              {benefit.title}
            </Text>
            <Text className='text-[13px] font-normal leading-[18px] text-stone-500'>
              {benefit.description}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

export const PremiumBenefitsRow = memo(PremiumBenefitsRowComponent);
