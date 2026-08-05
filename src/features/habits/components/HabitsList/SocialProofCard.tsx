/**
 * SocialProofCard — testimonial card in the monetization flow.
 *
 * Displays a user quote and attribution from {@link SOCIAL_PROOF} to build
 * trust and encourage trial conversion.  Purely presentational; no props.
 */

import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme/ThemeContext';
import { SOCIAL_PROOF } from './constants';

export function SocialProofCard() {
  const { colors } = useThemeColors();

  return (
    <View
      className='gap-3 rounded-3xl border p-5'
      style={{ borderColor: colors.border, backgroundColor: colors.background }}
    >
      <Text
        className='text-sm font-medium uppercase tracking-[2px]'
        style={{ color: colors.text.primary }}
      >
        Proven momentum
      </Text>
      <Text
        className='text-base font-normal leading-[22px]'
        style={{ color: colors.text.primary }}
      >
        {`"${SOCIAL_PROOF.quote}"`}
      </Text>
      <Text
        className='text-sm font-normal'
        style={{ color: colors.text.secondary }}
      >
        {SOCIAL_PROOF.attribution}
      </Text>
    </View>
  );
}
