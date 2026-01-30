import { Text, View } from 'react-native';

/**
 * Empty state shown when no habits exist
 */
export function EmptyState() {
  return (
    <View className='items-center px-6 py-8'>
      <Text className='text-[32px]'>📝</Text>
      <Text className='mt-2 text-center text-[15px] font-medium text-stone-500'>
        No habits yet
      </Text>
      <Text className='mt-1 text-center text-[13px] font-normal text-stone-400'>
        Create your first habit to start tracking
      </Text>
    </View>
  );
}
