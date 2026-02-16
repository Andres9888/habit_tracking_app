import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { useTranslation } from 'react-i18next';
import { AccessibleText } from '../../../../components/ui/AccessibleText';
import { AnimatedEntrance } from './AnimatedEntrance';
import { ENTRANCE_DELAYS } from './animations';
import { HeroIcon } from './HeroIcon';
import { useEmptyStateColors } from './useEmptyStateColors';

interface HeroSectionProps {
  isLoading: boolean;
  heroAnimatedStyle: AnimatedStyle;
  headlineAnimatedStyle: AnimatedStyle;
}

export function HeroSection({
  isLoading,
  heroAnimatedStyle,
  headlineAnimatedStyle,
}: HeroSectionProps) {
  const { t } = useTranslation();
  const colors = useEmptyStateColors();
  return (
    <Animated.View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      <Animated.View style={heroAnimatedStyle}>
        <AnimatedEntrance delay={ENTRANCE_DELAYS.heroIcon}>
          <HeroIcon animate={!isLoading} />
        </AnimatedEntrance>
      </Animated.View>

      <AnimatedEntrance delay={ENTRANCE_DELAYS.headline}>
        <Animated.Text
          accessibilityRole='header'
          style={[
            {
              color: colors.textPrimary,
              fontSize: 28,
              fontWeight: '800',
              letterSpacing: -0.5,
              lineHeight: 34,
              marginTop: 16,
              textAlign: 'center',
              width: '100%',
            },
            headlineAnimatedStyle,
          ]}
        >
          {t('habits.emptyStateHeadline')}
        </Animated.Text>
      </AnimatedEntrance>

      <AnimatedEntrance delay={ENTRANCE_DELAYS.headline + 50}>
        <AccessibleText
          scalingType='body'
          style={{
            color: colors.textSecondary,
            fontSize: 13,
            fontStyle: 'italic',
            lineHeight: 18,
            marginTop: 8,
            paddingHorizontal: 16,
            textAlign: 'center',
          }}
        >
          {t('habits.emptyStateMotivation')}
        </AccessibleText>
      </AnimatedEntrance>
    </Animated.View>
  );
}
