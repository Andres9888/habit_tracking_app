/** PremiumUpsellContent — crown, copy, and Upgrade pill inside premium hero */
import { Text, View } from 'react-native';
import { Crown } from 'lucide-react-native';
import { shadows } from '@/theme';
import { iconSizes } from '@/theme/iconSizes';
import { fontFamilies, typography, fontWeights } from '@/theme/typography';
import { premiumHero } from '../theme/premiumHero';

export function PremiumUpsellContent() {
  return (
    <View className='flex-row items-center'>
      <View
        className='mr-3.5 h-12 w-12 items-center justify-center rounded-2xl'
        style={{
          backgroundColor: premiumHero.iconBox,
          ...shadows.subtle,
        }}
      >
        <Crown color={premiumHero.crown} size={iconSizes.medium} />
      </View>
      <View className='flex-1'>
        <Text
          style={{
            ...typography.tabBar,
            fontWeight: fontWeights.bold,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            color: premiumHero.overline,
          }}
        >
          Chain Day Premium
        </Text>
        <Text
          className='mt-0.5'
          style={{
            ...typography.heading1,
            fontFamily: fontFamilies.serif,
            fontSize: 19,
            lineHeight: 23,
            color: premiumHero.title,
          }}
        >
          Make every habit feel intentional
        </Text>
        <Text
          className='mt-1'
          numberOfLines={2}
          style={{ ...typography.bodySmall, color: premiumHero.subtitle }}
        >
          Unlimited habits, reminders, sounds, and advanced progress cues.
        </Text>
      </View>
      <View
        className='rounded-full px-4 py-2'
        style={{ backgroundColor: premiumHero.pill }}
      >
        <Text
          style={{
            ...typography.bodySmall,
            fontWeight: fontWeights.bold,
            color: premiumHero.pillText,
          }}
        >
          Upgrade
        </Text>
      </View>
    </View>
  );
}
