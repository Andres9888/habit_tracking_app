import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { durations, enterEasing } from '../../../theme/animations';
import { useThemeColors } from '../../../theme/ThemeContext';

const ENTERING = FadeInDown.delay(durations.stagger).duration(durations.enter).easing(enterEasing);

interface StatsSummaryBarProps {
  habitCount: number;
  selectionMode: boolean;
  allSelected: boolean;
  onToggleSelectionMode: () => void;
  onSelectAll: () => void;
}

export function StatsSummaryBar({
  habitCount,
  selectionMode,
  allSelected,
  onToggleSelectionMode,
  onSelectAll,
}: StatsSummaryBarProps) {
  const { colors } = useThemeColors();

  if (habitCount === 0) return null;

  const selectLabel = selectionMode
    ? (allSelected ? 'Deselect All' : 'Select All')
    : 'Select';

  const onSelectPress = selectionMode ? onSelectAll : onToggleSelectionMode;

  return (
    <Animated.View entering={ENTERING}>
      <View
        className='mb-4 flex-row items-center justify-between rounded-xl px-4 py-3'
        style={{
          backgroundColor: selectionMode
            ? colors.status.successLight
            : colors.card,
        }}
      >
        <View className='flex-row items-center gap-2'>
          <Text className='text-lg'>📦</Text>
          <Text
            className='text-sm font-medium'
            style={{
              color: selectionMode
                ? colors.status.success
                : colors.text.secondary,
            }}
          >
            {habitCount} archived habit{habitCount === 1 ? '' : 's'}
          </Text>
        </View>
        <Pressable
          accessibilityRole='button'
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          onPress={onSelectPress}
        >
          <Text
            className='text-sm font-semibold'
            style={{ color: colors.primary[600] }}
          >
            {selectLabel}
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}
