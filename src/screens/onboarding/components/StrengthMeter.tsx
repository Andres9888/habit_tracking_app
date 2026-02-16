import { colors } from '../../../theme/colors';
import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { t } from '../../../i18n';

const STAGE_KEYS = [
  'strength.starting',
  'strength.building',
  'strength.developing',
  'strength.strong',
  'strength.automatic',
] as const;

function interpolateColor(t: number): string {
  if (t < 0.5) return '#10B981';
  if (t < 0.75) return colors.primary[600];
  return colors.primary[700];
}

export function StrengthMeter() {
  return (
    <View style={styles.container}>
      {STAGE_KEYS.map((key, i) => (
        <Animated.View
          key={key}
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
            {t(key)}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    backgroundColor: colors.primary[600],
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
    color: colors.primary[700],
    fontWeight: '700',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
});
