
import { View } from 'react-native';

import Animated, { FadeInDown } from 'react-native-reanimated';

export function SignUpHeader() {
  return (
    <View className='mb-8'>
      <Animated.Text
        className='mb-2 text-[34px] font-bold tracking-tight text-stone-900'
        entering={FadeInDown.delay(0).springify().damping(18)}
      >
        Create account
      </Animated.Text>
      <Animated.Text
        className='text-[17px] leading-[22px] text-stone-600'
        entering={FadeInDown.delay(50).springify().damping(18)}
      >
        Start your habit journey today
      </Animated.Text>
    </View>
  );
}
