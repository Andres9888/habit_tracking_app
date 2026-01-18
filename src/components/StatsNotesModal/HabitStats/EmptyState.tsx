/**
 * Empty state when no habits exist
 */

import { Text, View } from 'react-native';

export function EmptyState() {
  return (
    <View className='items-center py-8'>
      <Text className='text-center text-sm text-stone-500'>
        No habits yet. Create your first habit to see stats!
      </Text>
    </View>
  );
}
