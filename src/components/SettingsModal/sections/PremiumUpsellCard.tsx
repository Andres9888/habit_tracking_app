/** PremiumUpsellCard — quiet gold-tinted plan card (below controls, non-subscribers) */
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { shadows } from '@/theme';
import { fontFamilies, typography, fontWeights } from '@/theme/typography';
import { airy } from '@/theme/airyScale';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getRaisedSurface } from '../raisedSurface';

interface PremiumUpsellCardProps {
  onUpgrade?: () => void;
}

export function PremiumUpsellCard({ onUpgrade }: PremiumUpsellCardProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const goldBorder = isDark ? '#5C5230' : '#E8D48A';
  const surface = getRaisedSurface(isDark);

  return (
    <LinearGradient
      className='overflow-hidden'
      colors={[themeColors.status.warningLight, surface]}
      end={{ x: 0, y: 1 }}
      start={{ x: 0, y: 0 }}
      style={{
        borderColor: goldBorder,
        borderRadius: airy.cardRadius,
        borderWidth: 1,
        padding: 16,
        ...shadows.card,
      }}
    >
      <Text
        style={{
          ...typography.caption,
          fontWeight: fontWeights.semibold,
          textTransform: 'uppercase',
          letterSpacing: 0.8,
          color: themeColors.text.secondary,
        }}
      >
        Chain Day Premium
      </Text>
      <Text
        className='mt-1.5'
        style={{
          fontFamily: fontFamilies.serif,
          fontSize: 18,
          fontWeight: fontWeights.bold,
          letterSpacing: -0.3,
          color: themeColors.text.primary,
        }}
      >
        A little more room to grow
      </Text>
      <Text
        className='mb-3.5 mt-1.5'
        style={{ ...typography.bodySmall, color: themeColors.text.secondary }}
      >
        Unlimited habits, calendar themes, and gentle extras — without turning
        Settings into a storefront.
      </Text>
      <AnimatedPressable
        accessibilityHint='Opens premium upgrade screen'
        accessibilityLabel='See Premium'
        accessibilityRole='button'
        onPress={onUpgrade}
      >
        <View
          className='w-full items-center justify-center'
          style={{
            backgroundColor: themeColors.status.success,
            borderRadius: airy.buttonRadius,
            height: 48,
          }}
        >
          <Text
            style={{
              ...typography.body,
              fontWeight: fontWeights.semibold,
              color: '#FFFFFF',
            }}
          >
            See Premium
          </Text>
        </View>
      </AnimatedPressable>
    </LinearGradient>
  );
}
