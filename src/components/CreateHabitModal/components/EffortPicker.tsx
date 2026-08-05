import { Pressable, Text, View } from 'react-native';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '@/theme/ThemeContext';
import { fontWeights, typography } from '@/theme/typography';

const EFFORT_PRESETS = [
  { label: 'S', minutes: 5 },
  { label: 'M', minutes: 15 },
  { label: 'L', minutes: 30 },
] as const;

interface EffortPickerProps {
  value?: number;
  onChange: (minutes: number | undefined) => void;
}

export function EffortPicker({ value, onChange }: EffortPickerProps) {
  const { colors } = useThemeColors();

  return (
    <View style={{ gap: 10, marginTop: 20 }}>
      <View style={{ alignItems: 'center', gap: 3 }}>
        <Text
          style={{
            ...typography.caption,
            color: colors.text.tertiary,
            fontWeight: fontWeights.semibold,
            letterSpacing: 0.5,
            textTransform: 'uppercase',
          }}
        >
          Effort
        </Text>
        <Text
          style={{
            ...typography.caption,
            color: colors.text.secondary,
          }}
        >
          Pick a realistic time estimate
        </Text>
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        {EFFORT_PRESETS.map((preset) => {
          const selected = value === preset.minutes;
          return (
            <Pressable
              key={preset.minutes}
              accessibilityLabel={`${preset.label}, ${preset.minutes} minutes`}
              accessibilityRole='button'
              accessibilityState={{ selected }}
              style={({ pressed }) => ({
                alignItems: 'center',
                backgroundColor: selected ? colors.primary[100] : colors.card,
                borderColor: selected ? colors.primary[600] : colors.cardBorder,
                borderCurve: 'continuous',
                borderRadius: 14,
                borderWidth: selected ? 2 : 1,
                flex: 1,
                gap: 2,
                opacity: pressed ? 0.72 : 1,
                paddingVertical: 11,
              })}
              testID={`effort-preset-${preset.minutes}`}
              onPress={() => {
                void triggerHaptic('selection');
                onChange(selected ? undefined : preset.minutes);
              }}
            >
              <Text
                style={{
                  ...typography.body,
                  color: selected ? colors.primary[700] : colors.text.primary,
                  fontWeight: fontWeights.semibold,
                }}
              >
                {preset.label}
              </Text>
              <Text
                style={{
                  ...typography.caption,
                  color: selected ? colors.primary[700] : colors.text.secondary,
                  fontVariant: ['tabular-nums'],
                }}
              >
                {preset.minutes} min
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Text
        style={{
          ...typography.caption,
          color: colors.text.tertiary,
          textAlign: 'center',
        }}
      >
        No selection uses a gentle 10-minute forecast.
      </Text>
    </View>
  );
}
