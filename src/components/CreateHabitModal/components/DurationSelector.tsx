/**
 * DurationSelector - Choose habit duration for micro-habits
 *
 * Implements the 2-minute rule with preset durations: 2, 5, 10, 15, 30, 60 minutes
 * or custom duration input.
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Keyboard,
} from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

interface DurationOption {
  label: string;
  value: number;
}

const DURATION_OPTIONS: DurationOption[] = [
  { label: '2 min', value: 2 },
  { label: '5 min', value: 5 },
  { label: '10 min', value: 10 },
  { label: '15 min', value: 15 },
  { label: '30 min', value: 30 },
  { label: '1 hour', value: 60 },
];

interface DurationSelectorProps {
  selectedDuration: number | null;
  onDurationSelect: (duration: number | null) => void;
}

export function DurationSelector({
  selectedDuration,
  onDurationSelect,
}: DurationSelectorProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const [isCustom, setIsCustom] = useState(false);
  const [customValue, setCustomValue] = useState('');

  const handlePresetSelect = (value: number) => {
    setIsCustom(false);
    onDurationSelect(value);
  };

  const handleCustomPress = () => {
    setIsCustom(true);
    setCustomValue('');
  };

  const handleCustomChange = (text: string) => {
    setCustomValue(text);
    const num = parseInt(text, 10);
    if (!isNaN(num) && num > 0) {
      onDurationSelect(num);
    } else if (text === '') {
      onDurationSelect(null);
    }
  };

  const handleCustomSubmit = () => {
    Keyboard.dismiss();
  };

  const isSelected = (value: number) => !isCustom && selectedDuration === value;
  const isCustomSelected = isCustom && customValue !== '';

  return (
    <View className="mb-6">
      <Text
        className="mb-3 text-center text-xs font-semibold"
        style={{ letterSpacing: 1, color: themeColors.text.tertiary }}
      >
        DURATION (OPTIONAL)
      </Text>

      <View className="flex-row flex-wrap justify-center gap-2">
        {DURATION_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            onPress={() => handlePresetSelect(option.value)}
            className="rounded-xl px-4 py-2"
            style={{
              backgroundColor: isSelected(option.value)
                ? '#047857'
                : isDark
                  ? themeColors.card
                  : '#FFFFFF',
              borderWidth: 1.5,
              borderColor: isSelected(option.value)
                ? '#047857'
                : isDark
                  ? themeColors.border
                  : themeColors.border,
            }}
            activeOpacity={0.7}
            accessibilityLabel={`${option.label} duration`}
            accessibilityRole="radio"
            accessibilityState={{ selected: isSelected(option.value) }}
          >
            <Text
              className="text-sm font-medium"
              style={{
                color: isSelected(option.value) ? '#FFFFFF' : themeColors.text.primary,
              }}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          onPress={handleCustomPress}
          className="rounded-xl px-4 py-2"
          style={{
            backgroundColor: isCustomSelected
              ? '#047857'
              : isDark
                ? themeColors.card
                : '#FFFFFF',
            borderWidth: 1.5,
            borderColor: isCustomSelected
              ? '#047857'
              : isDark
                ? themeColors.border
                : themeColors.border,
          }}
          activeOpacity={0.7}
          accessibilityLabel="Custom duration"
          accessibilityRole="radio"
          accessibilityState={{ selected: isCustomSelected }}
        >
          {isCustom ? (
            <TextInput
              autoFocus
              value={customValue}
              onChangeText={handleCustomChange}
              onSubmitEditing={handleCustomSubmit}
              placeholder="Custom"
              placeholderTextColor={themeColors.text.tertiary}
              keyboardType="number-pad"
              className="w-20 text-center text-sm font-medium"
              style={{
                color: isCustomSelected ? '#FFFFFF' : themeColors.text.primary,
                height: 20,
              }}
              returnKeyType="done"
            />
          ) : (
            <Text
              className="text-sm font-medium"
              style={{
                color: isCustomSelected ? '#FFFFFF' : themeColors.text.primary,
              }}
            >
              Custom
            </Text>
          )}
        </TouchableOpacity>
      </View>

      {selectedDuration && selectedDuration <= 5 && (
        <View className="mt-3 items-center">
          <Text className="text-xs" style={{ color: '#059669' }}>
            ⚡ Micro-habit - Quick win!
          </Text>
        </View>
      )}
    </View>
  );
}
