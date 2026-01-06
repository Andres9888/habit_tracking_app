import { View } from 'react-native';
import { SortChip } from './SortChip';
import type { HabitSortMode } from '../types';

interface HabitsSectionHeaderProps {
  habitSortMode: HabitSortMode;
  onPress: () => void;
  habitCount?: number;
  reduceMotion?: boolean;
}

/**
 * HabitsSectionHeader - Simplified header row with just the SortChip component.
 *
 * Previously contained "My Habits" label and a modal for sort options.
 * Now just displays the SortChip which opens the SortBottomSheet.
 */
export function HabitsSectionHeader({
  habitSortMode,
  onPress,
  habitCount = 0,
  reduceMotion = false,
}: HabitsSectionHeaderProps) {
  return (
    <View className="px-1">
      <SortChip
        habitCount={habitCount}
        reduceMotion={reduceMotion}
        sortMode={habitSortMode}
        onPress={onPress}
      />
    </View>
  );
}
