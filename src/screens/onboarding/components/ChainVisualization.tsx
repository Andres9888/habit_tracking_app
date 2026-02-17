import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

function ChainLink({ delay, index, chainColors }: { delay: number; index: number; chainColors: string[] }) {
  const { colors, isDark } = useThemeColors();
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={[
        styles.chainLink,
        { backgroundColor: chainColors[index % chainColors.length] },
      ]}
    >
      <View style={[styles.chainLinkInner, { backgroundColor: isDark ? colors.background : '#FFFFFF' }]} />
    </Animated.View>
  );
}

export function ChainVisualization() {
  const { colors } = useThemeColors();
  const chainColors = [
    colors.primary[600],
    colors.primary[700],
    colors.primary[500],
    colors.primary[700],
    colors.primary[600],
    colors.primary[500],
    colors.primary[700],
  ];

  return (
    <View style={styles.chainContainer}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <ChainLink key={i} chainColors={chainColors} delay={400 + i * 120} index={i} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  chainContainer: {
    alignItems: 'center',
    flexDirection: 'row',
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
    backgroundColor: undefined, // Set dynamically
    borderRadius: 12,
    height: 36,
    width: 20,
  },
});
