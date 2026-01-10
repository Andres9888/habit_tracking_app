import { Text, View } from 'react-native';

interface StatsSummaryBarProps {
  habitCount: number;
}

export function StatsSummaryBar({ habitCount }: StatsSummaryBarProps) {
  if (habitCount === 0) return null;

  return (
    <View className='mb-4 flex-row items-center justify-between rounded-xl bg-stone-50 px-4 py-3'>
      <View className='flex-row items-center gap-2'>
        <Text className='text-lg'>📦</Text>
        <Text className='text-sm font-medium text-stone-600'>
          {habitCount} archived habit{habitCount === 1 ? '' : 's'}
        </Text>
      </View>
    </View>
  );
}
