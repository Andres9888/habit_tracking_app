/** PremiumUpsellCard — gold conversion card for non-subscribers */
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { typography, fontWeights } from '@/theme/typography';
import { airy } from '@/theme/airyScale';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';
import { PremiumUpsellContent } from './PremiumUpsellContent';

interface PremiumUpsellCardProps {
  onUpgrade?: () => void;
}

const GOLD_GRADIENT = ['#FDF3D2', '#F6E2A6'] as const;

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
          colors={GOLD_GRADIENT}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={{
            borderColor: '#EAD08F',
            borderRadius: airy.cardRadius,
            borderWidth: 1,
            shadowColor: '#7C5A08',
            shadowOffset: { height: 2, width: 0 },
            shadowOpacity: 0.16,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <PremiumUpsellContent />
        </LinearGradient>
      </AnimatedPressable>
    </View>
  );
}
