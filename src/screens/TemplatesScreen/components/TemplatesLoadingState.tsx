/** TemplatesLoadingState - OPTIMIZED: Shimmer animation, stagger, shadows */
import { View, Text } from 'react-native';
import Animated, {
  FadeIn,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { useEffect } from 'react';

function ShimmerBox({
  width,
  height,
  delay = 0,
  style,
}: {
  width: number | string;
  height: number;
  delay?: number;
  style?: object;
}) {
  const opacity = useSharedValue(0.4);
  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 1000 }), -1, true)
    );
  }, [delay, opacity]);
  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));
  return (
    <Animated.View
      style={[
        { backgroundColor: '#e7e5e4', borderRadius: 8, height, width },
        animStyle,
        style,
      ]}
    />
  );
}

function SkeletonCard({ index }: { index: number }) {
  const d = index * 100;
  return (
    <Animated.View
      className='mx-5 my-2 rounded-2xl bg-white p-5'
      entering={FadeIn.duration(300).delay(d)}
      style={{
        elevation: 3,
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.06,
        shadowRadius: 12,
      }}
    >
      <View className='flex-row items-center gap-4'>
        <ShimmerBox
          delay={d}
          height={48}
          style={{ borderRadius: 24 }}
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

export function TemplatesLoadingState() {
  return (
    <View className='flex-1 bg-[#faf9f7]'>
      <View className='px-5 pb-4 pt-6'>
        <Text
          className='font-bold text-stone-900'
          style={{ fontSize: 28, letterSpacing: -0.5 }}
        >
          Import Habits
        </Text>
        <Text className='mt-1 text-[15px] text-stone-500'>
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
