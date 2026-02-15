
import { StyleSheet, Text, View } from 'react-native';

import Animated, { FadeInDown } from 'react-native-reanimated';

const STAGES = ['Starting', 'Building', 'Growing', 'Strong', 'Automatic'];

function interpolateColor(t: number): string {
  if (t < 0.5) return '#10B981';
  if (t < 0.75) return '#059669';
  return '#047857';
}

export function StrengthMeter() {
  return (
    <View style={styles.container}>
      {STAGES.map((stage, i) => (
        <Animated.View
          key={stage}
          entering={FadeInDown.delay(400 + i * 200)
            .springify()
            .damping(18)}
          style={styles.row}
        >
          <View
            style={[
              styles.bar,
              {
                backgroundColor: interpolateColor(i / 4),
                opacity: 0.15 + i * 0.2125,
                width: `${20 + i * 20}%`,
              },
            ]}
          />
          <Text style={[styles.label, i === 4 && styles.labelActive]}>
            {stage}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: '#059669',
    borderRadius: 8,
    height: 32,
  },
  container: {
    gap: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  label: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '500',
  },
  labelActive: {
    color: '#047857',
    fontWeight: '700',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
});
