/**
 * Empty state for filtered template list
 * Standardized: FadeInUp animation, proper typography
 */

import { Text, View } from 'react-native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export const TemplateListEmpty = () => (
  <View
    accessibilityLabel='No habits found in this category. Try selecting a different category.'
    accessibilityRole='text'
    className='items-center justify-center py-12'
  >
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
      <Search color='#78716c' size={28} strokeWidth={1.5} />
    </Animated.View>
    <Animated.Text
      className='text-[17px] font-semibold text-stone-800'
      entering={anim(60)}
    >
      No Habits in This Category
    </Animated.Text>
    <Animated.Text
      className='mt-1 text-[13px] text-stone-500'
      entering={anim(120)}
    >
      Try selecting a different category
    </Animated.Text>
  </View>
);
