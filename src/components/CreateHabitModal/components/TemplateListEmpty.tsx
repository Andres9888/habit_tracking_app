import { Text, View } from 'react-native';

export const TemplateListEmpty = () => (
  <View
    accessibilityLabel='No habits found in this category. Try selecting a different category.'
    accessibilityRole='text'
    className='items-center justify-center py-12'
  >
    <Text accessibilityElementsHidden className='text-2xl'>
      🔍
    </Text>
    <Text className='mt-2 text-[15px] font-medium text-stone-800'>
      No habits in this category
    </Text>
    <Text className='mt-1 text-[13px] font-normal text-stone-500'>
      Try selecting a different category
    </Text>
  </View>
);
