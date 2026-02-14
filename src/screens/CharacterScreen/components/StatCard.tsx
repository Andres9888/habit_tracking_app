import { Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { typography } from '../../../theme/typography';
import type { StatCardProps } from '../types';

export function StatCard({
  emoji,
  value,
  label,
  delay = 0,
}: StatCardProps & { delay?: number }) {
  return (
    <Animated.View
      className='flex-1 flex-col items-center gap-1 rounded-2xl border border-stone-100 bg-white px-4 py-4'
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={{
        shadowColor: '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: 0.08,
        shadowRadius: 16,
      }}
    >
      <Text className='text-2xl leading-8'>{emoji}</Text>
      <Text
        className='font-semibold text-[#1c1917]'
        style={typography.body}
      >
        {value}
      </Text>
      <Text
        className='text-center text-[#78716c]'
        style={typography.caption}
      >
        {label}
      </Text>
    </Animated.View>
  );
}
