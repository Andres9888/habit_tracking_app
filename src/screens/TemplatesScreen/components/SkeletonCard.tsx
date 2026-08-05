import { View } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { borderRadius } from '../../../theme/spacing';
import { useSkeletonTheme } from '../../../components/SkeletonLoader/useSkeletonTheme';
import { ShimmerBox } from './ShimmerBox';

export function SkeletonCard({ index }: { index: number }) {
  const { cardBg, shadowColor, shadowOpacity } = useSkeletonTheme();
  const staggerDelay = index * 100;
  return (
    <Animated.View
      className='mx-5 my-2 rounded-2xl p-5'
      entering={FadeIn.duration(300).delay(staggerDelay)}
      style={{
        backgroundColor: cardBg,
        elevation: 4,
        shadowColor,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity,
        shadowRadius: 16,
      }}
    >
      <View className='flex-row items-center gap-4'>
        <ShimmerBox
          delay={staggerDelay}
          height={48}
          style={{ borderRadius: borderRadius.card }}
          width={48}
        />
        <View className='flex-1 gap-2'>
          <ShimmerBox delay={staggerDelay + 50} height={18} width='70%' />
          <ShimmerBox delay={staggerDelay + 100} height={14} width='50%' />
        </View>
      </View>
      <View className='mt-4 gap-2'>
        <ShimmerBox delay={staggerDelay + 150} height={12} width='100%' />
        <ShimmerBox delay={staggerDelay + 200} height={12} width='80%' />
      </View>
      <View className='mt-4 flex-row gap-2'>
        <ShimmerBox
          delay={staggerDelay + 250}
          height={24}
          style={{ borderRadius: borderRadius.medium }}
          width={70}
        />
        <ShimmerBox
          delay={staggerDelay + 300}
          height={24}
          style={{ borderRadius: borderRadius.medium }}
          width={60}
        />
      </View>
    </Animated.View>
  );
}
