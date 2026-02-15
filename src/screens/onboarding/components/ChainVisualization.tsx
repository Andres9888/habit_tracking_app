
import { StyleSheet, View } from 'react-native';

import Animated, { FadeInDown } from 'react-native-reanimated';

const COLORS = [
  '#059669',
  '#047857',
  '#10B981',
  '#047857',
  '#059669',
  '#10B981',
  '#047857',
];

function ChainLink({ delay, index }: { delay: number; index: number }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={[
        styles.chainLink,
        { backgroundColor: COLORS[index % COLORS.length] },
      ]}
    >
      <View style={styles.chainLinkInner} />
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
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 36,
    width: 20,
  },
});
