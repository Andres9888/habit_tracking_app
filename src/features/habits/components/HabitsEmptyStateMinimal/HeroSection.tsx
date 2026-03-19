import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { typography } from '@/theme/typography';
import { AnimatedEntrance } from './AnimatedEntrance';
import { ENTRANCE_DELAYS } from './animations';
import { COPY } from './constants';
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
              ...typography.heading1,
              color: colors.textPrimary,
              letterSpacing: -0.5,
              lineHeight: 34,
              marginTop: 16,
              textAlign: 'center',
              width: '100%',
            },
            headlineAnimatedStyle,
          ]}
        >
          {COPY.headline}
        </Animated.Text>
      </AnimatedEntrance>

      {/* Social-proof stat removed at user request */}
    </Animated.View>
  );
}
