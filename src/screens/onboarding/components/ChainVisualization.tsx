import { colors, useThemeColors } from '../../../theme/colors';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

const COLORS = [
  colors.primary[600],
  colors.primary[700],
  colors.primary[500],
  colors.primary[700],
  colors.primary[600],
  colors.primary[500],
  colors.primary[700],
];

function ChainLink({ delay, index }: { delay: number; index: number }) {
  const themeColors = useThemeColors();
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={[
        styles.chainLink,
        { backgroundColor: COLORS[index % COLORS.length] },
      ]}
    >
      <View style={[styles.chainLinkInner, { backgroundColor: themeColors.card }]} />
    </Animated.View>
  );
}

export function ChainVisualization() {
  return (
    <View style={styles.chainContainer}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <ChainLink key={i} delay={400 + i * 120} index={i} />
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
    borderRadius: 12,
    height: 36,
    width: 20,
  },
});
