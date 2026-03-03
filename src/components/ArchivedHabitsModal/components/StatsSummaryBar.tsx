import { Text, View } from 'react-native';
import { useThemeColors } from '../../../theme/ThemeContext';

interface StatsSummaryBarProps {
  habitCount: number;
}

export function StatsSummaryBar({ habitCount }: StatsSummaryBarProps) {
  const { isDark } = useThemeColors();

  if (habitCount === 0) return null;

  return (
    <View
      className='mb-4 flex-row items-center justify-center rounded-xl px-4 py-3 gap-2'
      style={{
        backgroundColor: isDark ? '#1f2937' : '#fafaf9',
      }}
    >
      <Text className='text-lg'>📦</Text>
      <Text
        className='text-sm font-medium'
        style={{ color: isDark ? '#d1d5db' : '#57534e' }}
      >
        {habitCount} archived habit{habitCount === 1 ? '' : 's'}
      </Text>
    </View>
  );
}
