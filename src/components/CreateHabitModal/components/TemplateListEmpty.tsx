import { Text, View } from 'react-native';

export const TemplateListEmpty = () => (
  <View className='items-center justify-center py-12'>
    <Text className='text-2xl'>🔍</Text>
    <Text className='mt-2 text-[15px] font-medium text-stone-800'>No habits in this category</Text>
    <Text className='mt-1 text-[15px] text-stone-500'>Try selecting a different category</Text>
  </View>
);
