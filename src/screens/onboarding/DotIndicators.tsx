/**
 * DotIndicators — page indicator dots for the onboarding carousel.
 */

import { View } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { styles } from './OnboardingScreen.styles';
import { PAGES } from './onboarding.data';

export function DotIndicators({ currentIndex }: { currentIndex: number }) {
  const { colors } = useThemeColors();
  return (
    <View
      accessible
      accessibilityLabel={`Page ${currentIndex + 1} of ${PAGES.length}`}
      accessibilityRole='tablist'
      style={styles.dotsContainer}
    >
      {PAGES.map((_, i) => (
        <Animated.View
          key={i}
          accessibilityLabel={`Page ${i + 1}${i === currentIndex ? ', current' : ''}`}
          accessibilityRole='tab'
          accessibilityState={{ selected: i === currentIndex }}
          style={[
            styles.dot,
            {
              backgroundColor:
                i === currentIndex ? colors.primary[600] : colors.gray[300],
              width: i === currentIndex ? 24 : 8,
            },
          ]}
        />
      ))}
    </View>
  );
}
