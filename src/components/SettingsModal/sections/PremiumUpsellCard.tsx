/** PremiumUpsellCard — editorial forest conversion card for non-subscribers */
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { shadows } from '@/theme';
import { typography, fontWeights } from '@/theme/typography';
import { airy } from '@/theme/airyScale';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';
import { premiumHero } from '../theme/premiumHero';
import { PremiumUpsellContent } from './PremiumUpsellContent';

interface PremiumUpsellCardProps {
  onUpgrade?: () => void;
}

export function PremiumUpsellCard({ onUpgrade }: PremiumUpsellCardProps) {
  const { colors: themeColors } = useThemeColors();

  return (
    <View className='gap-2'>
      <Text
        className='px-1'
        style={{
          ...typography.caption,
          fontWeight: fontWeights.semibold,
          textTransform: 'uppercase',
          letterSpacing: 0.7,
          color: themeColors.text.secondary,
        }}
      >
        Subscription
      </Text>
      <AnimatedPressable
        accessibilityHint='Opens premium upgrade screen'
        accessibilityLabel='Go Premium'
        accessibilityRole='button'
        onPress={onUpgrade}
      >
        <LinearGradient
          className='overflow-hidden rounded-2xl px-4 py-4'
          colors={premiumHero.gradient}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={{
            borderColor: premiumHero.border,
            borderRadius: airy.cardRadius,
            borderWidth: 1,
            ...shadows.card,
          }}
        >
          <PremiumUpsellContent />
        </LinearGradient>
      </AnimatedPressable>
    </View>
  );
}
