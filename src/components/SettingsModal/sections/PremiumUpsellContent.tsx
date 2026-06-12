/** PremiumUpsellContent — icon, copy, and pulsing PRO badge inside the upsell card */
import { Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { Zap } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { colors as palette, overlays } from '@/theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';

interface PremiumUpsellContentProps {
  isDark: boolean;
  badgePulseStyle: React.ComponentProps<typeof Animated.View>['style'];
}

export function PremiumUpsellContent({
  isDark,
  badgePulseStyle,
}: PremiumUpsellContentProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='flex-row items-center'>
      <View
        className='mr-4 h-10 w-10 items-center justify-center rounded-xl'
        style={{ backgroundColor: overlays.glassLight }}
      >
        <Zap color={palette.text.inverse} size={iconSizes.medium} />
      </View>
      <View className='flex-1'>
        <Text
          style={{
            ...typography.body,
            fontWeight: fontWeights.bold,
            color: isDark ? '#E0E7FF' : palette.text.inverse,
          }}
        >
          Upgrade to Premium
        </Text>
        <Text
          className='mt-0.5'
          style={{
            ...typography.caption,
            color: isDark ? 'rgba(224,231,255,0.6)' : overlays.subTextOnHero,
          }}
        >
          Unlock sounds, reminders & more
        </Text>
      </View>
      <Animated.View
        className='rounded-full px-3.5 py-1.5'
        style={[{ backgroundColor: overlays.glassLight }, badgePulseStyle]}
      >
        <Text
          style={{
            ...typography.caption,
            fontWeight: fontWeights.bold,
            color: isDark
              ? themeColors.status.premiumText
              : palette.text.inverse,
          }}
        >
          PRO
        </Text>
      </Animated.View>
    </View>
  );
}
