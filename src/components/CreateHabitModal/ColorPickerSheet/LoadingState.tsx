import { ActivityIndicator, Text, View } from 'react-native';

export function LoadingState() {
  return (
    <View
      accessible
      accessibilityLabel='Loading color picker'
      accessibilityRole='progressbar'
      className='items-center justify-center'
      style={{ height: 400 }}
    >
      <ActivityIndicator color='#1c1917' size='large' />
      <Text className='mt-4 text-sm text-stone-500'>
        Loading color picker...
      </Text>
    </View>
  );
}
