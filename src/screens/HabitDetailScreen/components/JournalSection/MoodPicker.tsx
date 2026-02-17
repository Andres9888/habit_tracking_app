import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../../../../theme';
import { MOOD_EMOJIS, MOOD_LABELS, type MoodType } from './types';

const MOODS: MoodType[] = ['frustrated', 'neutral', 'happy', 'fire'];

interface MoodPickerProps {
  selected: MoodType | null;
  onSelect: (mood: MoodType) => void;
}

export function MoodPicker({ selected, onSelect }: MoodPickerProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <View className='flex-row justify-between px-2'>
      {MOODS.map((mood) => {
        const isSelected = selected === mood;
        return (
          <TouchableOpacity
            key={mood}
            accessibilityLabel={MOOD_LABELS[mood]}
            accessibilityRole='button'
            accessibilityState={{ selected: isSelected }}
            className='items-center rounded-2xl px-3 py-2'
            style={{
              backgroundColor: isSelected
                ? isDark
                  ? 'rgba(5, 150, 105, 0.2)'
                  : 'rgba(4, 120, 87, 0.1)'
                : 'transparent',
              borderColor: isSelected ? '#059669' : 'transparent',
              borderWidth: 2,
            }}
            onPress={() => onSelect(mood)}
          >
            <Text className='text-2xl'>{MOOD_EMOJIS[mood]}</Text>
            <Text
              className='mt-1 text-[11px] font-medium'
              style={{ color: isSelected ? '#059669' : colors.text.secondary }}
            >
              {MOOD_LABELS[mood]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
