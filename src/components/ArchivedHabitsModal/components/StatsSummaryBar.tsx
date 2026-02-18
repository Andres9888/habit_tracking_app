import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import { AnimatedPressable } from '../../ui';

interface StatsSummaryBarProps {
  habitCount: number;
  onDeleteAll?: () => void;
}

export function StatsSummaryBar({ habitCount, onDeleteAll }: StatsSummaryBarProps) {
  const { isDark } = useThemeColors();

  if (habitCount === 0) return null;

  return (
    <View
      className='mb-4 flex-row items-center justify-between rounded-xl px-4 py-3'
      style={{
        backgroundColor: isDark ? '#1f2937' : '#fafaf9',
      }}
    >
      <View className='flex-row items-center gap-2'>
        <Text className='text-lg'>📦</Text>
        <Text
          className='text-sm font-medium'
          style={{ color: isDark ? '#d1d5db' : '#57534e' }}
        >
          {habitCount} archived habit{habitCount === 1 ? '' : 's'}
        </Text>
      </View>
      {habitCount > 1 && onDeleteAll && (
        <AnimatedPressable
          accessibilityLabel='Delete all archived habits'
          accessibilityRole='button'
          className='rounded-lg px-3 py-1.5'
          style={{
            backgroundColor: isDark ? '#7f1d1d' : '#fef2f2',
          }}
          onPress={onDeleteAll}
        >
          <Text
            className='text-xs font-semibold'
            style={{ color: isDark ? '#fca5a5' : '#dc2626' }}
          >
            Delete All
          </Text>
        </AnimatedPressable>
      )}
    </View>
  );
}
