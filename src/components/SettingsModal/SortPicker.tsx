/**
 * SortPicker — inline sort mode selector for the Settings modal.
 * Renders a list of sort options with check marks for the active mode.
 */

import { Text, View } from 'react-native';
import { Check } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AnimatedPressable } from '@/components/ui/AnimatedPressable';
import { ScreenHeader } from '@/components/ScreenHeader';
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
  const { isDark, colors } = useThemeColors();

  const handleSelect = (mode: HabitSortMode) => {
    triggerHaptic('tap');
    onSelect(mode);
  };

  const DARK_SURFACE = '#1f2937';
  const SELECTED_LIGHT_BG = '#ecfdf5';

  return (
    <View className='flex-1' style={{ backgroundColor: colors.background }}>
      <View style={{ backgroundColor: colors.background }}>
        <ScreenHeader
          leftAction='back'
          rightAction={null}
          title='Sort Order'
          onBack={onBack}
        />
      </View>
      <View className='px-4 pt-2'>
        {SORT_PICKER_OPTIONS.map((option) => {
          const selected = currentMode === option.value;
          return (
            <AnimatedPressable
              key={option.value}
              accessibilityHint={`Select ${option.label} sort option`}
              accessibilityLabel={`${option.label}. ${option.description}`}
              accessibilityRole='radio'
              accessibilityState={{ checked: selected }}
              className='mb-1 flex-row items-center gap-3 rounded-xl px-3 py-3'
              style={{
                backgroundColor: selected
                  ? isDark ? DARK_SURFACE : SELECTED_LIGHT_BG
                  : 'transparent',
                borderColor: selected ? colors.primary[300] : 'transparent',
                borderWidth: selected ? 1 : 0,
              }}
              onPress={() => handleSelect(option.value)}
            >
              <LinearGradient
                className='h-10 w-10 items-center justify-center rounded-xl'
                colors={option.iconBgColors}
                end={{ x: 1, y: 1 }}
                start={{ x: 0, y: 0 }}
              >
                <option.Icon color='#ffffff' size={18} strokeWidth={2.25} />
              </LinearGradient>
              <View className='flex-1'>
                <Text
                  className='text-[15px] font-medium'
                  style={{ color: colors.text.primary }}
                >
                  {option.label}
                </Text>
                <Text
                  className='text-[13px] font-normal'
                  style={{ color: colors.text.secondary }}
                >
                  {option.description}
                </Text>
              </View>
              {selected ? (
                <View
                  className='h-6 w-6 items-center justify-center rounded-full'
                  style={{ backgroundColor: colors.primary[500] }}
                >
                  <Check color='#ffffff' size={14} strokeWidth={2.5} />
                </View>
              ) : null}
            </AnimatedPressable>
          );
        })}
      </View>
    </View>
  );
}
