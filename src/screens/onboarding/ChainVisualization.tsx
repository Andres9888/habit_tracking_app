/**
 * ChainVisualization — animated chain link display for onboarding.
 */

import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { durations, enterEasing } from '../../theme/animations';
import { useThemeColors } from '../../theme/ThemeContext';
import { visualStyles as styles } from './onboarding.visuals.styles';

function ChainLink({
  delay,
  index,
  reduceMotion,
}: {
  delay: number;
  index: number;
  reduceMotion: boolean;
}) {
  const { colors } = useThemeColors();
  const chainColors = [
    colors.primary[600],
    colors.primary[700],
    colors.primary[400],
    colors.primary[700],
    colors.primary[600],
    colors.primary[400],
    colors.primary[700],
  ];
  return (
    <Animated.View
      entering={
        reduceMotion
          ? undefined
          : FadeInDown.delay(delay)
              .duration(durations.enter)
              .easing(enterEasing)
      }
      style={[
        styles.chainLink,
        {
          backgroundColor: chainColors[index % chainColors.length],
          transform: [{ rotate: '0deg' }],
        },
      ]}
    >
      <View
        style={[
          styles.chainLinkInner,
          {
            backgroundColor: colors.surface,
            borderColor: colors.cardBorder,
            borderWidth: 1,
          },
        ]}
      />
    </Animated.View>
  );
}

export function ChainVisualization({
  reduceMotion,
}: {
  reduceMotion: boolean;
}) {
  return (
    <View style={styles.chainContainer}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <ChainLink
          key={i}
          delay={durations.emphasis + i * 2 * durations.stagger}
          index={i}
          reduceMotion={reduceMotion}
        />
      ))}
    </View>
  );
}
