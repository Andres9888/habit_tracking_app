/** Direction chip for non-custom sort modes */
import { useCallback, useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import type { LayoutChangeEvent } from 'react-native';
import Animated from 'react-native-reanimated';
import { ArrowDown, ArrowUp } from 'lucide-react-native';
import { iconSizes } from '@/theme/iconSizes';
import { typography, fontWeights } from '@/theme/typography';
import * as Haptics from 'expo-haptics';
import { useReduceMotion } from '@/hooks/useReduceMotion';
import { useExpandAnimation } from '@/hooks/useExpandAnimation';
import { useThemeColors } from '../../../theme/ThemeContext';
import { getSegmentedControlColors } from '../SegmentedControl.colors';
import {
  getSortFamily,
  isAscending,
  modeFromFamily,
} from '../SortOrderPicker.constants';
import type { HabitSortMode } from '../../../features/habits/types';

interface SortDirectionChipProps {
  selected: HabitSortMode;
  onSelect: (mode: HabitSortMode) => void;
}

export function SortDirectionChip({
  selected,
  onSelect,
}: SortDirectionChipProps) {
  const { isDark } = useThemeColors();
  const { accent, selectedBg } = getSegmentedControlColors(isDark);
  const family = getSortFamily(selected);
  const ascending = isAscending(selected);
  const showDirection = family !== 'manual';
  const reduceMotion = useReduceMotion();
  const [chipHeight, setChipHeight] = useState(0);
  const [chipMeasured, setChipMeasured] = useState(false);

  const { contentAnimatedStyle } = useExpandAnimation({
    contentHeight: chipHeight,
    defaultExpanded: showDirection,
    hasContentMeasured: chipMeasured,
    reduceMotion,
  });

  const handleChipLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { height } = event.nativeEvent.layout;
      if (height <= 0) return;
      if (chipMeasured && !showDirection) return;
      setChipHeight((prev) => (prev === height ? prev : height));
      setChipMeasured(true);
    },
    [chipMeasured, showDirection]
  );

  useEffect(() => {
    if (!showDirection) setChipMeasured(false);
  }, [showDirection]);

  const DirectionIcon = ascending ? ArrowUp : ArrowDown;

  const handleDirectionToggle = () => {
    void Haptics.selectionAsync();
    onSelect(modeFromFamily(family, !ascending));
  };

  return (
    <Animated.View
      pointerEvents={showDirection ? 'auto' : 'none'}
      style={contentAnimatedStyle}
    >
      <View className='flex-row items-center pt-2' onLayout={handleChipLayout}>
        <View className='mr-4 w-10' />
        <Pressable
          accessibilityLabel={
            ascending ? 'Ascending order' : 'Descending order'
          }
          accessibilityRole='button'
          className='flex-row items-center gap-1 rounded-lg px-2.5 py-1.5'
          style={{ backgroundColor: selectedBg }}
          onPress={handleDirectionToggle}
        >
          <DirectionIcon
            color={accent}
            size={iconSizes.small}
            strokeWidth={2.5}
          />
          <Text
            style={{
              ...typography.caption,
              color: accent,
              fontWeight: fontWeights.semibold,
            }}
          >
            {ascending ? 'Low → High' : 'High → Low'}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
