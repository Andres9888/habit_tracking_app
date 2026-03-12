/**
 * SortPicker — inline sort mode selector for the Settings modal.
 * Renders a list of sort options with check marks for the active mode.
 */

import { Text, View, Pressable } from 'react-native';
import { Check, ArrowLeft } from 'lucide-react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemeColors } from '../../theme/ThemeContext';
import { SORT_PICKER_OPTIONS } from './SortPicker.constants';
import type { HabitSortMode } from '../../features/habits/types';
import { triggerHaptic } from '@/utils/haptics';

interface SortPickerProps {
  currentMode: HabitSortMode;
  onBack: () => void;
  onSelect: (mode: HabitSortMode) => void;
}

export function SortPicker({ currentMode, onBack, onSelect }: SortPickerProps) {
  const insets = useSafeAreaInsets();
  const { isDark, colors } = useThemeColors();

  const handleSelect = (mode: HabitSortMode) => {
    triggerHaptic('tap');
    onSelect(mode);
  };

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <View
        className='flex-row items-center gap-3 border-b px-4 pb-3'
        style={{
          borderColor: colors.border,
          paddingTop: insets.top + 8,
        }}
      >
        <Pressable
          accessibilityLabel='Back to settings'
          accessibilityRole='button'
          hitSlop={12}
          onPress={onBack}
        >
          <ArrowLeft color={colors.text.primary} size={22} strokeWidth={2} />
        </Pressable>
        <Text
          className='text-[20px] font-bold'
          style={{ color: colors.text.primary }}
        >
          Sort Order
        </Text>
      </View>
      <View className='px-4 pt-3'>
        {SORT_PICKER_OPTIONS.map((option) => (
          <Pressable
            key={option.value}
            accessibilityRole='radio'
            accessibilityState={{ selected: currentMode === option.value }}
            className='flex-row items-center rounded-xl px-4 py-3.5'
            style={({ pressed }) => ({
              backgroundColor: pressed
                ? isDark
                  ? 'rgba(255,255,255,0.05)'
                  : 'rgba(0,0,0,0.03)'
                : 'transparent',
            })}
            onPress={() => handleSelect(option.value)}
          >
            <View className='flex-1'>
              <Text
                className='text-[16px] font-semibold'
                style={{ color: colors.text.primary }}
              >
                {option.label}
              </Text>
              <Text
                className='text-[13px]'
                style={{ color: colors.text.secondary }}
              >
                {option.description}
              </Text>
            </View>
            {currentMode === option.value ? <Check color={colors.primary[500]} size={20} strokeWidth={2.5} /> : null}
          </Pressable>
        ))}
      </View>
    </View>
  );
}
