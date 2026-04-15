import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';
import { useThemeColors } from '../../theme/ThemeContext';
import type { StreakGoalSectionProps } from './StreakGoalSection.types';

const PRESETS = [7, 14, 21, 30, 60, 90] as const;

export function StreakGoalSection({ goalDuration, onGoalChange }: StreakGoalSectionProps) {
  const { colors } = useThemeColors();
  const [customValue, setCustomValue] = useState('');

  const handlePreset = (days: number) => {
    setCustomValue('');
    onGoalChange(days === goalDuration ? null : days);
  };

  const handleCustomChange = (text: string) => {
    setCustomValue(text);
    const parsed = Number.parseInt(text, 10);
    if (parsed >= 1 && parsed <= 3650) {
      onGoalChange(parsed);
    }
  };

  const handleClear = () => {
    setCustomValue('');
    onGoalChange(null);
  };

  const isPresetSelected = (days: number) => goalDuration === days && !customValue;

  return (
    <View>
      <Text style={{ color: colors.text.tertiary, fontSize: 12, marginBottom: 10 }}>
        Set a streak target to work toward
      </Text>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
        {PRESETS.map((days) => (
          <Pressable
            key={days}
            style={{
              flex: 1,
              minWidth: '30%',
              paddingVertical: 10,
              borderRadius: 10,
              borderWidth: 1.5,
              borderColor: isPresetSelected(days) ? colors.status.streak : colors.border,
              backgroundColor: isPresetSelected(days) ? colors.status.streakLight : colors.background,
              alignItems: 'center',
            }}
            onPress={() => handlePreset(days)}
          >
            <Text style={{
              fontSize: 15,
              fontWeight: '600',
              color: isPresetSelected(days) ? colors.status.streak : colors.text.primary,
            }}>
              {days}
            </Text>
            <Text style={{
              fontSize: 11,
              color: isPresetSelected(days) ? colors.status.streak : colors.text.tertiary,
            }}>
              days
            </Text>
          </Pressable>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <TextInput
          keyboardType='number-pad'
          maxLength={4}
          placeholder='Custom days...'
          placeholderTextColor={colors.text.tertiary}
          style={{
            flex: 1,
            backgroundColor: colors.background,
            borderWidth: 1.5,
            borderColor: customValue ? colors.status.streak : colors.border,
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 10,
            color: colors.text.primary,
            fontSize: 15,
            fontWeight: '500',
          }}
          value={customValue}
          onChangeText={handleCustomChange}
        />
        <Pressable
          style={{
            backgroundColor: colors.status.errorLight,
            borderWidth: 1,
            borderColor: 'rgba(248,113,113,0.3)',
            borderRadius: 10,
            paddingHorizontal: 14,
            paddingVertical: 10,
            justifyContent: 'center',
          }}
          onPress={handleClear}
        >
          <Text style={{ color: colors.status.error, fontSize: 13, fontWeight: '600' }}>
            No Goal
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
