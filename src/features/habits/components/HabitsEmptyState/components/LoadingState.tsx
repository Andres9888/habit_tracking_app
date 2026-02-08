import { ActivityIndicator, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

export function LoadingState() {
  return (
    <View className='items-center justify-center gap-5 py-24'>
      <Animated.View
        className='h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-amber-100 to-orange-100'
        entering={FadeInDown.delay(100).springify().damping(18)}
      >
        <Text className='text-3xl'>🌱</Text>
      </Animated.View>
      <View className='items-center gap-2'>
        <Animated.Text
          className='text-[17px] font-semibold text-stone-700'
          entering={FadeInDown.delay(200).springify().damping(18)}
        >
          Preparing your habit garden
        </Animated.Text>
        <Animated.View
          className='flex-row items-center gap-1'
          entering={FadeInDown.delay(300).springify().damping(18)}
        >
          <ActivityIndicator color='#d97706' size='small' />
          <Text className='text-[13px] font-medium italic text-stone-400'>
            Good things take a moment...
          </Text>
        </Animated.View>
      </View>
    </View>
  );
}
