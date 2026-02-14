/**
 * SocialProofCard Component
 * Displays testimonial quote with dark mode support
 */

import { Text, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { SOCIAL_PROOF } from './constants';

export function SocialProofCard() {
  const { colors, isDark } = useThemeColors();

  return (
    <View
      className='gap-3 rounded-3xl border p-5'
      style={{
        backgroundColor: isDark ? colors.card : 'rgba(250, 248, 245, 0.8)',
        borderColor: isDark ? colors.cardBorder : '#DDD8D2',
      }}
    >
      <Text
        className='text-[13px] font-medium uppercase tracking-[2px]'
        style={{ color: colors.text.secondary }}
      >
        Proven momentum
      </Text>
      <Text
        className='text-[17px] font-normal leading-[22px]'
        style={{ color: colors.text.primary }}
      >
        &ldquo;{SOCIAL_PROOF.quote}&rdquo;
      </Text>
      <Text
        className='text-[13px] font-normal'
        style={{ color: colors.text.tertiary }}
      >
        {SOCIAL_PROOF.attribution}
      </Text>
    </View>
  );
}
