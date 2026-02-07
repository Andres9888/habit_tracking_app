import { Text, View } from 'react-native';

export function SectionDivider() {
  return (
    <View className='flex-row items-center gap-3 py-2'>
      <View className='h-[1px] flex-1 bg-stone-200' />
      <Text className='text-[13px] font-semibold text-stone-500'>
        Or pick one to start now
      </Text>
      <View className='h-[1px] flex-1 bg-stone-200' />
    </View>
  );
}
