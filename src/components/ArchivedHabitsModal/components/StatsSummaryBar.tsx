import { Text, TouchableOpacity, View } from 'react-native';

interface StatsSummaryBarProps {
  habitCount: number;
  onDeleteAll?: () => void;
}

export function StatsSummaryBar({ habitCount, onDeleteAll }: StatsSummaryBarProps) {
  if (habitCount === 0) return null;

  return (
    <View className='mb-4 flex-row items-center justify-between rounded-xl bg-stone-50 px-4 py-3'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-lg'>📦</Text>
        <Text className='text-sm font-medium text-stone-600'>
          {habitCount} archived habit{habitCount === 1 ? '' : 's'}
        </Text>
      </View>
      {habitCount > 1 && onDeleteAll && (
        <TouchableOpacity
          accessibilityLabel='Delete all archived habits'
          accessibilityRole='button'
          className='rounded-lg bg-red-50 px-3 py-1.5'
          onPress={onDeleteAll}
        >
          <Text className='text-xs font-semibold text-red-500'>Delete All</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
