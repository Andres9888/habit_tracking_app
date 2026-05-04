import { Pressable, Text, TextInput, View } from 'react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';
import { typography, fontWeights } from '../../../../theme/typography';

interface TimeGoalsSheetSectionProps {
  label: string;
  unit: string;
  value: string;
  chips: Array<{ label: string; minutes: number }>;
  onChangeValue: (v: string) => void;
  onPickChip: (minutes: number) => void;
}

export function TimeGoalsSheetSection({
  label,
  unit,
  value,
  chips,
  onChangeValue,
  onPickChip,
}: TimeGoalsSheetSectionProps) {
  const { colors } = useThemeColors();

  return (
    <View className='mb-4'>
      <Text
        className='mb-2'
        style={{
          ...typography.caption,
          color: colors.text.tertiary,
          fontWeight: fontWeights.semibold,
          letterSpacing: 0.4,
          textTransform: 'uppercase',
        }}
      >
        {label}
      </Text>
      <View className='mb-2 flex-row items-center justify-center' style={{ gap: 8 }}>
        <TextInput
          className='rounded-xl px-4 py-2.5 text-center'
          keyboardType='number-pad'
          maxLength={4}
          placeholder='0'
          placeholderTextColor={colors.text.tertiary}
          style={{
            backgroundColor: colors.surface,
            color: colors.text.primary,
            fontSize: 22,
            fontWeight: fontWeights.semibold,
            minWidth: 110,
          }}
          value={value}
          onChangeText={onChangeValue}
        />
        <Text style={{ ...typography.bodySmall, color: colors.text.secondary }}>{unit}</Text>
      </View>
      <View className='flex-row flex-wrap justify-center' style={{ gap: 6 }}>
        {chips.map((chip) => (
          <Pressable
            key={chip.label}
            accessibilityRole='button'
            className='rounded-full px-3 py-1.5'
            style={{ backgroundColor: colors.surface }}
            onPress={() => onPickChip(chip.minutes)}
          >
            <Text style={{ ...typography.caption, color: colors.text.primary, fontWeight: fontWeights.semibold }}>
              {chip.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
