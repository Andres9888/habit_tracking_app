import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ShimmerBox } from './ShimmerBox';

export function SkeletonCard({ index }: { index: number }) {
  const d = index * 100;
  return (
    <Animated.View
      className='mx-5 my-2 rounded-2xl bg-white p-5'
      entering={FadeIn.duration(280).delay(d).springify().damping(18)}
      style={{
        elevation: 4,
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <View className='flex-row items-center gap-4'>
        <ShimmerBox
          delay={d}
          height={48}
          style={{ borderRadius: 16 }}
          width={48}
        />
        <View className='flex-1 gap-2'>
          <ShimmerBox delay={d + 50} height={18} width='70%' />
          <ShimmerBox delay={d + 100} height={14} width='50%' />
        </View>
      </View>
      <View className='mt-4 gap-2'>
        <ShimmerBox delay={d + 150} height={12} width='100%' />
        <ShimmerBox delay={d + 200} height={12} width='80%' />
      </View>
      <View className='mt-4 flex-row gap-2'>
        <ShimmerBox
          delay={d + 250}
          height={24}
          style={{ borderRadius: 12 }}
          width={70}
        />
        <ShimmerBox
          delay={d + 300}
          height={24}
          style={{ borderRadius: 12 }}
          width={60}
        />
      </View>
    </Animated.View>
  );
}
