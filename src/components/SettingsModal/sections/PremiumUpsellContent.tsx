/** PremiumUpsellContent — spec 4a banner row: chip, two lines of copy, pill.
 *  Single compact row; the long serif headline was dropped with the redesign. */
import { Text, View } from 'react-native';
import { Crown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { premiumHero } from '../theme/premiumHero';

export function PremiumUpsellContent() {
  return (
    <View className='flex-row items-center' style={{ gap: 13 }}>
      <View
        className='items-center justify-center'
        style={{
          backgroundColor: premiumHero.iconBox,
          borderRadius: 13,
          height: 40,
          width: 40,
        }}
      >
        <Crown color={premiumHero.crown} size={iconSizes.small} />
      </View>
      <View className='min-w-0 flex-1'>
        <Text
          numberOfLines={1}
          style={{
            ...typography.body,
            fontSize: 16,
            fontWeight: fontWeights.semibold,
            color: premiumHero.title,
          }}
        >
          Chain Day Premium
        </Text>
        <Text
          numberOfLines={1}
          style={{
            ...typography.caption,
            marginTop: 2,
            color: premiumHero.subtitle,
          }}
        >
          Unlimited habits &amp; reminders
        </Text>
      </View>
      <View
        style={{
          backgroundColor: premiumHero.pill,
          borderRadius: 20,
          paddingHorizontal: 18,
          paddingVertical: 10,
        }}
      >
        <Text
          style={{
            ...typography.bodySmall,
            fontWeight: fontWeights.semibold,
            color: premiumHero.pillText,
          }}
        >
          Upgrade
        </Text>
      </View>
    </View>
  );
}
