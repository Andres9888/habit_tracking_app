import { ActivityIndicator, Text, View } from 'react-native';

export function LoadingState() {
  return (
    <View className='items-center justify-center py-16'>
      <ActivityIndicator color='#78716c' size='large' />
      <Text className='mt-3 text-sm text-stone-400'>
        Loading deleted habits...
      </Text>
    </View>
  );
}
