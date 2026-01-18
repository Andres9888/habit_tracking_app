import { Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';

import {
  getPeriodEmoji,
  getParticlesForPeriod,
} from '../../HabitsEmptyState.utils';
import type { WelcomeHeroProps } from '../../HabitsEmptyState.types';
import { FloatingParticle } from '../FloatingParticle';
import { useWelcomeHeroAnimations } from './useWelcomeHeroAnimations';

export function WelcomeHero({ greeting, period }: WelcomeHeroProps) {
  const { waveStyle, streakStyle, glowStyle } = useWelcomeHeroAnimations();
  const periodEmoji = getPeriodEmoji(period);
  const particles = getParticlesForPeriod(period);

  return (
    <Animated.View
      className='relative w-full items-center gap-2.5 overflow-hidden rounded-2xl border border-amber-200 px-5 py-5'
      entering={FadeInDown.delay(0).springify().damping(18)}
      style={{
        backgroundColor: '#fffbeb',
        elevation: 2,
        shadowColor: '#f59e0b',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
      }}
    >
      <Animated.View
        className='absolute inset-0 rounded-3xl'
        style={[glowStyle, { backgroundColor: '#fcd34d' }]}
      />
      <View className='absolute inset-0' pointerEvents='none'>
        <View className='absolute left-4 top-4'>
          <FloatingParticle delay={0} duration={2500} emoji={particles[0]} />
        </View>
        <View className='absolute right-6 top-6'>
          <FloatingParticle delay={400} duration={3000} emoji={particles[1]} />
        </View>
        <View className='absolute bottom-4 left-8'>
          <FloatingParticle delay={800} duration={2800} emoji={particles[2]} />
        </View>
        <View className='absolute bottom-6 right-4'>
          <FloatingParticle delay={200} duration={3200} emoji='🌱' />
        </View>
      </View>
      <Animated.Text className='text-3xl' style={waveStyle}>
        👋
      </Animated.Text>
      <View className='items-center gap-1.5'>
        <Text className='text-[22px] font-semibold tracking-tight text-stone-800'>
          {greeting}!
        </Text>
        <Text className='text-center text-[15px] font-medium leading-[22px] text-stone-700'>
          Small habits lead to big changes
        </Text>
        <Text className='text-center text-[13px] leading-[18px] text-stone-500'>
          Your first streak starts with one tap {periodEmoji}
        </Text>
      </View>
      <Animated.View
        className='flex-row items-center gap-1.5 rounded-full bg-white/80 px-3 py-1.5'
        style={[
          streakStyle,
          {
            elevation: 3,
            shadowColor: '#f59e0b',
            shadowOffset: { height: 3, width: 0 },
            shadowOpacity: 0.18,
            shadowRadius: 6,
          },
        ]}
      >
        <Text className='text-base'>🔥</Text>
        <Text className='text-[10px] font-medium tracking-wide text-amber-700'>
          Day 1 begins now
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
