import { Pressable, ScrollView, Text } from 'react-native';

import { useHaptics } from '../../../../utils/haptics/useHaptics';
import { useThemeColors } from '../../../../theme/ThemeContext';
import type { HabitSortMode } from '../../types';
import {
  CHECK_ICON_SIZE,
  DARK_SURFACE_COLOR,
  LIGHT_SURFACE_COLOR,
  QUICK_PICK_OPTIONS,
  SORT_OPTION_ICON_STROKE_WIDTH,
  WHITE_ICON_COLOR,
} from './constants';

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
                  ? DARK_SURFACE_COLOR
                  : LIGHT_SURFACE_COLOR,
              minHeight: 44,
            }}
            onPress={() => {
              trigger('tap');
              onSelect(option.value);
            }}
          >
            <option.Icon
              color={isSelected ? WHITE_ICON_COLOR : themeColors.text.secondary}
              size={CHECK_ICON_SIZE}
              strokeWidth={SORT_OPTION_ICON_STROKE_WIDTH}
            />
            <Text
              className='text-sm font-medium'
              style={{
                color: isSelected ? WHITE_ICON_COLOR : themeColors.text.primary,
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
