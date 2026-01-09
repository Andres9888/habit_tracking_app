import { Text, View } from 'react-native';

export function Divider() {
  return (
    <View
      accessible
      accessibilityRole='none'
      className='my-4 flex-row items-center gap-4'
      importantForAccessibility='no-hide-descendants'
    >
      <View className='h-[1px] flex-1 bg-stone-200' />
      <Text aria-hidden className='text-xs text-stone-400'>
        OR
      </Text>
      <View className='h-[1px] flex-1 bg-stone-200' />
    </View>
  );
}
