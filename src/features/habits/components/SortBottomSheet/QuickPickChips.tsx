import { Pressable, ScrollView, Text } from 'react-native';

import { useHaptics } from '../../../../utils/haptics/useHaptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { HabitSortMode } from '../../types';
import { QUICK_PICK_OPTIONS } from './constants';

interface QuickPickChipsProps {
  sortMode: HabitSortMode;
  onSelect: (mode: HabitSortMode) => void;
}

export function QuickPickChips({ sortMode, onSelect }: QuickPickChipsProps) {
  const { colors: themeColors, isDark } = useThemeColors();
  const { trigger } = useHaptics();

  return (
    <ScrollView
      horizontal
      className='mb-4'
      contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
      showsHorizontalScrollIndicator={false}
    >
      {QUICK_PICK_OPTIONS.map((option) => {
        const isSelected = sortMode === option.value;
        return (
          <Pressable
            key={option.value}
            accessibilityHint={`Select ${option.chipLabel} sort option`}
            accessibilityLabel={option.chipLabel}
            accessibilityRole='radio'
            accessibilityState={{ checked: isSelected }}
            className='flex-row items-center gap-1.5 rounded-full px-4 py-2.5'
            style={{
              backgroundColor: isSelected
                ? themeColors.primary[600]
                : isDark
                  ? themeColors.gray[800]
                  : themeColors.gray[100],
              minHeight: 44,
            }}
            onPress={() => {
              trigger('tap');
              onSelect(option.value);
            }}
          >
            <option.Icon
              color={isSelected ? '#ffffff' : themeColors.text.secondary}
              size={14}
              strokeWidth={2.25}
            />
            <Text
              className='text-[13px] font-medium'
              style={{
                color: isSelected ? '#ffffff' : themeColors.text.primary,
              }}
            >
              {option.chipLabel}
            </Text>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
