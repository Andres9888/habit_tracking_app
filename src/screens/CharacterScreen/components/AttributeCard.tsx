import { View, Text } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown } from 'react-native-reanimated';
import type { AttributeCardProps } from '../types';

export function AttributeCard({
  icon,
  name,
  value,
  maxValue,
  gradientColors,
  bgGradient,
}: AttributeCardProps) {
  const percentage = (value / maxValue) * 100;

  return (
    <Animated.View
      className='overflow-hidden rounded-3xl border border-stone-100 bg-white'
      entering={FadeInDown.duration(400)}
    >
      <View className='relative h-[110px]'>
        <View
          className='absolute left-0 top-0 h-full opacity-60'
          style={{ width: `${percentage}%` }}
        >
          <LinearGradient
            colors={bgGradient}
            end={{ x: 1, y: 0 }}
            start={{ x: 0, y: 0 }}
            style={{ height: '100%', width: '100%' }}
          />
        </View>

        <View className='flex-col gap-3 px-6 pt-6'>
          <View className='flex-row items-center justify-between'>
            <View className='flex-row items-center gap-3'>
              <View className='h-10 w-10 items-center justify-center rounded-full bg-white shadow-md dark:bg-stone-800'>
                {icon}
              </View>
              <Text className='text-base font-normal leading-6 tracking-[-0.3125px] text-stone-900 dark:text-stone-100'>
                {name}
              </Text>
            </View>
            <Text className='text-base font-normal leading-6 tracking-[-0.3125px] text-stone-900 dark:text-stone-100'>
              {value}
            </Text>
          </View>

          <View className='h-2 w-full overflow-hidden rounded-full bg-stone-100'>
            <View style={{ width: `${percentage}%` }}>
              <LinearGradient
                colors={gradientColors}
                end={{ x: 1, y: 0 }}
                start={{ x: 0, y: 0 }}
                style={{ borderRadius: 9999, height: '100%', width: '100%' }}
              />
            </View>
          </View>
        </View>
      </View>
    </Animated.View>
  );
}
