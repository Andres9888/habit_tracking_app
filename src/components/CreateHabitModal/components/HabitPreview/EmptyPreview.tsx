/**
 * Empty state for HabitPreview
 */
import { Text, View } from 'react-native';

export const EmptyPreview = () => (
  <View className='items-center py-4'>
    <Text className='mb-2 text-4xl'>✨</Text>
    <Text className='mb-1 text-sm font-medium text-stone-500'>
      Your habit will appear here
    </Text>
    <Text className='text-xs text-stone-400'>
      Try: "Meditate", "Run", or "Read"
    </Text>
  </View>
);
