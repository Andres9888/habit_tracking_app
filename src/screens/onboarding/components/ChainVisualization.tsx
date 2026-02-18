import { View, StyleSheet } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

/**
 * Renders a single animated chain link in the onboarding chain graphic.
 *
 * @param delay  - Entrance animation delay in ms (staggered per link).
 * @param index  - Position in the chain; determines color via modulo cycling.
 * @param reduceMotion - When true, skips entrance animation entirely.
 */
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
          : FadeInDown.delay(delay).springify().damping(18)
      }
      style={[
        styles.chainLink,
        {
          backgroundColor: chainColors[index % chainColors.length],
          transform: [{ rotate: '0deg' }], // Uniform rotation (placeholder for future alternating style)
        },
      ]}
    >
      <View style={styles.chainLinkInner} />
    </Animated.View>
  );
}

/**
 * Renders the full 7-link chain graphic for onboarding page 1.
 * Links cascade in with a 120ms stagger starting at 400ms.
 *
 * @param reduceMotion - Forwarded to each `ChainLink` for a11y.
 */
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
          delay={400 + i * 120}
          index={i}
          reduceMotion={reduceMotion}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: -4,
  },
  chainLink: {
    alignItems: 'center',
    borderRadius: 16,
    height: 52,
    justifyContent: 'center',
    marginHorizontal: -2,
    width: 36,
  },
  chainLinkInner: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 36,
    width: 20,
  },
});
