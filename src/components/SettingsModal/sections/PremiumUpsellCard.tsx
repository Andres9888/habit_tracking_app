/** PremiumUpsellCard — gradient conversion card for non-subscribers */
import { StyleSheet, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { typography, fontWeights } from '@/theme/typography';
import { AnimatedPressable } from '../../ui/AnimatedPressable';
import { colors as palette } from '@/theme/colors';
import { useThemeColors } from '../../../theme/ThemeContext';
import { usePremiumUpsellAnimations } from './PremiumStatus.hooks';
import { getUpsellGradient } from './PremiumStatus.helpers';
import { PremiumUpsellContent } from './PremiumUpsellContent';

interface PremiumUpsellCardProps {
  onUpgrade?: () => void;
}

const styles = StyleSheet.create({
  shimmerOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});

export function PremiumUpsellCard({ onUpgrade }: PremiumUpsellCardProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const { shimmerStyle, badgePulseStyle } = usePremiumUpsellAnimations(true);

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
        accessibilityLabel='Upgrade to Premium'
        accessibilityRole='button'
        onPress={onUpgrade}
      >
        <LinearGradient
          className='overflow-hidden rounded-2xl px-4 py-5'
          colors={[...getUpsellGradient(isDark)]}
          end={{ x: 1, y: 1 }}
          start={{ x: 0, y: 0 }}
          style={{
            shadowColor: palette.premium[500],
            shadowOffset: { height: 4, width: 0 },
            shadowOpacity: isDark ? 0.15 : 0.3,
            shadowRadius: 16,
            elevation: 6,
          }}
        >
          {/* Shimmer sweep overlay */}
          <Animated.View style={[styles.shimmerOverlay, shimmerStyle]}>
            {/* Intentional rgba for shimmer transparency effect */}
            <LinearGradient
              colors={['transparent', 'rgba(255,255,255,0.6)', 'transparent']}
              end={{ x: 1, y: 0 }}
              start={{ x: 0, y: 0 }}
              style={{ width: 120, height: '100%' }}
            />
          </Animated.View>
          <PremiumUpsellContent
            badgePulseStyle={badgePulseStyle}
            isDark={isDark}
          />
        </LinearGradient>
      </AnimatedPressable>
    </View>
  );
}
