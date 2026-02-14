/** TemplatesLoadingState - Shimmer animation, stagger, shadows */
import { View, Text } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ShimmerBox } from './ShimmerBox';
import { SkeletonCard } from './SkeletonCard';

export function TemplatesLoadingState() {
  return (
    <View className='flex-1 bg-[#FAF8F5]'>
      <View className='px-5 pb-4 pt-6'>
        <Text
          className='font-semibold text-stone-900'
          style={{ fontSize: 22, letterSpacing: -0.35 }}
        >
          Browse Templates
        </Text>
        <Text className='mt-1 text-[17px] text-stone-500'>
          Science-backed habits to get you started
        </Text>
      </View>
      <Animated.View className='mx-5 mb-4' entering={FadeIn.duration(300)}>
        <ShimmerBox height={48} style={{ borderRadius: 24 }} width='100%' />
      </Animated.View>
      {[0, 1, 2, 3].map((i) => (
        <SkeletonCard key={i} index={i} />
      ))}
    </View>
  );
}
