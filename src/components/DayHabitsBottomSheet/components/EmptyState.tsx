/**
 * Empty state shown when no habits exist
 * Standardized: FadeInUp animation, proper typography
 */

import { Text, View } from 'react-native';
import { ClipboardList } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  return (
    <View className='items-center px-6 py-10'>
      {/* Icon */}
      <Animated.View
        className='mb-4 h-14 w-14 items-center justify-center rounded-xl bg-stone-100'
        entering={anim(0)}
        style={{
          shadowColor: '#1c1917',
          shadowOffset: { height: 4, width: 0 },
          shadowOpacity: 0.06,
          shadowRadius: 12,
        }}
      >
        <ClipboardList color='#78716c' size={28} strokeWidth={1.5} />
      </Animated.View>

      {/* Title */}
      <Animated.Text
        className='mb-1 text-center font-semibold text-stone-700'
        entering={anim(60)}
        style={{ fontSize: 17 }}
      >
        No Habits Yet
      </Animated.Text>

      {/* Description */}
      <Animated.Text
        className='text-center text-[13px] text-stone-500'
        entering={anim(120)}
      >
        Create your first habit to start tracking
      </Animated.Text>
    </View>
  );
}
