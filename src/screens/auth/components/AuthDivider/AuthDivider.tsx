import { Text, View } from 'react-native';

export function AuthDivider() {
  return (
    <View className='my-6 flex-row items-center'>
      <View className='h-px flex-1 bg-stone-200' />
      <Text className='mx-4 text-xs font-medium tracking-widest text-stone-500'>
        or
      </Text>
      <View className='h-px flex-1 bg-stone-200' />
    </View>
  );
}
