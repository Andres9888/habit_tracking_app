import { StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';

const STAGES = ['Starting', 'Building', 'Growing', 'Strong', 'Automatic'];

export function StrengthMeter() {
  const { colors } = useThemeColors();

  const interpolateColor = (t: number): string => {
    if (t < 0.5) return colors.primary[500];
    if (t < 0.75) return colors.primary[600];
    return colors.primary[700];
  };

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
          <Text
            style={[
              styles.label,
              { color: colors.text.tertiary },
              i === 4 && { color: colors.primary[700], fontWeight: '700' },
            ]}
          >
            {stage}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderRadius: 8,
    height: 32,
  },
  container: {
    gap: 12,
    paddingHorizontal: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
});
