import { Text, View } from 'react-native';

export const TemplateListEmpty = () => (
  <View className='items-center justify-center py-12'>
    <Text className='text-2xl'>🔍</Text>
    <Text className='mt-2 text-sm font-medium text-[#1a1a1a]'>No templates in this category</Text>
    <Text className='mt-1 text-xs text-[#8a8a8a]'>Try selecting a different category</Text>
  </View>
);
