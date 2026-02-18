import { colors } from '../../../theme/colors';
import { StyleSheet, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

const COLORS = [
  colors.primary[600],
  colors.primary[700],
  '#10B981',
  colors.primary[700],
  colors.primary[600],
  '#10B981',
  colors.primary[700],
];

function ChainLink({ delay, index, innerColor }: { delay: number; index: number; innerColor: string }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={[
        styles.chainLink,
        { backgroundColor: COLORS[index % COLORS.length] },
      ]}
    >
      <View style={[styles.chainLinkInner, { backgroundColor: innerColor }]} />
    </Animated.View>
  );
}

export function ChainVisualization() {
  const { colors: themeColors } = useThemeColors();

  return (
    <View style={styles.chainContainer}>
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <ChainLink key={i} delay={400 + i * 120} index={i} innerColor={themeColors.card} />
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
