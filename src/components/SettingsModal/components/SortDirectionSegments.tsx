/** Two-segment direction control matching SortFamilyPicker styling */
import { Pressable, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import { triggerHaptic } from '@/utils/haptics';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getSegmentedControlColors } from '../SegmentedControl.colors';
import {
  SORT_DIRECTION_LABELS,
  getSortFamily,
  isAscending,
  modeFromFamily,
} from '../SortOrderPicker.constants';
import type { HabitSortMode } from '../../../features/habits/types';

interface SortDirectionSegmentsProps {
  selected: HabitSortMode;
  onSelect: (mode: HabitSortMode) => void;
  onLayout: (event: LayoutChangeEvent) => void;
}

const DIRECTION_OPTIONS = [
  { ascending: true, Icon: ArrowUp },
  { ascending: false, Icon: ArrowDown },
] as const;

export function SortDirectionSegments({
  selected,
  onSelect,
  onLayout,
}: SortDirectionSegmentsProps) {
  const { colors, isDark } = useThemeColors();
  const { accent, selectedBg, containerBg } = getSegmentedControlColors(isDark);
  const family = getSortFamily(selected);
  // 'manual' sorting has no asc/desc direction, so there is nothing to render.
  if (family === 'manual') return null;
  const ascending = isAscending(selected);
  const labels = SORT_DIRECTION_LABELS[family];

  const handleDirectionSelect = (nextAscending: boolean) => {
    if (nextAscending === ascending) return;
    void triggerHaptic('selection');
    onSelect(modeFromFamily(family, nextAscending));
  };

  return (
    <View className='pt-2' onLayout={onLayout}>
      <View
        accessibilityRole='radiogroup'
        className='flex-row rounded-xl p-[3px]'
        style={{ backgroundColor: containerBg, gap: 2 }}
      >
        {DIRECTION_OPTIONS.map(({ ascending: isAsc, Icon }) => {
          const on = ascending === isAsc;
          const label = labels[isAsc ? 'asc' : 'desc'];
          return (
            <Pressable
              key={isAsc ? 'asc' : 'desc'}
              accessibilityLabel={label}
              accessibilityHint={`Set ${label.toLowerCase()} sort direction`}
              accessibilityRole='radio'
              accessibilityState={{ selected: on }}
              className='min-h-12 flex-1 flex-row items-center justify-center gap-1.5 rounded-lg px-2 py-2.5'
              hitSlop={4}
              style={{ backgroundColor: on ? selectedBg : 'transparent' }}
              onPress={() => handleDirectionSelect(isAsc)}
            >
              <Icon
                color={on ? accent : colors.text.secondary}
                size={iconSizes.small}
                strokeWidth={on ? 2.5 : 2}
              />
              <Text
                adjustsFontSizeToFit
                minimumFontScale={0.78}
                numberOfLines={2}
                style={{
                  ...typography.caption,
                  color: on ? accent : colors.text.secondary,
                  fontWeight: on ? fontWeights.semibold : fontWeights.regular,
                  lineHeight: 16,
                  textAlign: 'center',
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
