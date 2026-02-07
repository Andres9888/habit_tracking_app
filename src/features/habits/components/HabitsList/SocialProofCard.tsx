/**
 * SocialProofCard Component
 * Displays testimonial quote
 */

import { Text, View } from 'react-native';
import { SOCIAL_PROOF } from './constants';

export function SocialProofCard() {
  return (
    <View className='gap-3 rounded-3xl border border-stone-200 bg-stone-50/80 p-5'>
      <Text className='text-[13px] font-medium uppercase tracking-[2px] text-stone-700'>
        Proven momentum
      </Text>
      <Text className='text-[17px] font-normal leading-[22px] text-stone-800'>
        "{SOCIAL_PROOF.quote}"
      </Text>
      <Text className='text-[13px] font-normal text-stone-500'>
        {SOCIAL_PROOF.attribution}
      </Text>
    </View>
  );
}
