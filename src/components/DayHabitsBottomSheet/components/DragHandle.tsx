import { View } from 'react-native';

/**
 * Visual drag handle indicator for the bottom sheet
 */
export function DragHandle() {
  return (
    <View className='items-center py-3'>
      <View className='h-1 w-10 rounded-full bg-stone-300' />
    </View>
  );
}
