/** PremiumUpsellContent — crown, copy, and Upgrade pill inside the gold upsell card */
import { Text, View } from 'react-native';
import { Crown } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';

// Gold-card-specific shades (burnished gold family).
const GOLD = {
  iconBox: '#FFFFFF',
  crown: '#936A08',
  title: '#5A4406',
  subtitle: '#8A6A2A',
  pill: '#936A08',
};

export function PremiumUpsellContent() {
  return (
    <View className='flex-row items-center'>
      <View
        className='mr-3.5 h-11 w-11 items-center justify-center rounded-xl'
        style={{
          backgroundColor: GOLD.iconBox,
          shadowColor: '#7C5A08',
          shadowOffset: { height: 1, width: 0 },
          shadowOpacity: 0.18,
          shadowRadius: 3,
        }}
      >
        <Crown color={GOLD.crown} size={iconSizes.medium} />
      </View>
      <View className='flex-1'>
        <Text
          style={{
            ...typography.heading3,
            fontSize: 18,
            color: GOLD.title,
          }}
        >
          Go Premium
        </Text>
        <Text
          className='mt-0.5'
          style={{ ...typography.bodySmall, color: GOLD.subtitle }}
        >
          Sounds, reminders & unlimited habits
        </Text>
      </View>
      <View
        className='rounded-full px-4 py-2'
        style={{ backgroundColor: GOLD.pill }}
      >
        <Text
          style={{
            ...typography.bodySmall,
            fontWeight: fontWeights.bold,
            color: '#FFFFFF',
          }}
        >
          Upgrade
        </Text>
      </View>
    </View>
  );
}
