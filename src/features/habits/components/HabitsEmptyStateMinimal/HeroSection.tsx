import Animated, { AnimatedStyle } from 'react-native-reanimated';
import { useThemeColors } from '@/theme/ThemeContext';
import { AnimatedEntrance } from './AnimatedEntrance';
import { ENTRANCE_DELAYS } from './animations';
import { COPY } from './constants';
import { HeroIcon } from './HeroIcon';

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
  const { colors } = useThemeColors();

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
          style={[
            {
              color: colors.text.primary,
              fontWeight: '700',
              lineHeight: 32,
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
    </Animated.View>
  );
}
