/** Sort family segmented control for inline sort picker */
import { Pressable, Text, View } from 'react-native';
import { GripVertical } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getSegmentedControlColors } from '../SegmentedControl.colors';
import {
  SORT_FAMILIES,
  getSortFamily,
  isAscending,
  modeFromFamily,
  type SortFamily,
} from '../SortOrderPicker.constants';
import type { HabitSortMode } from '../../../features/habits/types';

interface SortFamilyPickerProps {
  selected: HabitSortMode;
  onSelect: (mode: HabitSortMode) => void;
}

export function SortFamilyPicker({
  selected,
  onSelect,
}: SortFamilyPickerProps) {
  const { colors, isDark } = useThemeColors();
  const { accent, selectedBg, containerBg } = getSegmentedControlColors(isDark);
  const family = getSortFamily(selected);
  const ascending = isAscending(selected);

  const handleFamilySelect = (key: SortFamily) => {
    if (key === family) return;
    void triggerHaptic('selection');
    onSelect(modeFromFamily(key, key === 'manual' ? true : ascending));
  };

  return (
    <View
      accessibilityRole='radiogroup'
      className='flex-row rounded-xl p-[3px]'
      style={{ backgroundColor: containerBg, gap: 2 }}
    >
      {SORT_FAMILIES.map(({ key, label }) => {
        const on = key === family;
        return (
          <Pressable
            key={key}
            accessibilityLabel={label}
            accessibilityRole='radio'
            accessibilityState={{ checked: on }}
            className='flex-1 items-center justify-center rounded-lg py-2'
            hitSlop={4}
            style={{ backgroundColor: on ? selectedBg : 'transparent' }}
            onPress={() => handleFamilySelect(key)}
          >
            {key === 'manual' ? (
              <GripVertical
                color={on ? accent : colors.text.secondary}
                size={iconSizes.small}
                strokeWidth={on ? 2.5 : 2}
              />
            ) : (
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.85}
                numberOfLines={1}
                style={{
                  ...typography.caption,
                  color: on ? accent : colors.text.secondary,
                  fontWeight: on ? fontWeights.semibold : fontWeights.regular,
                }}
              >
                {label}
              </Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}
