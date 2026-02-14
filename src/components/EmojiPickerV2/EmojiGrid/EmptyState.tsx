/**
 * Empty state shown when no emojis match search
 * Polished: spring entrance animation, consistent styling
 */

import { View, Text } from 'react-native';
import { Search } from 'lucide-react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { styles } from './styles';

const anim = (delay: number) =>
  FadeInUp.duration(280).delay(delay).springify().damping(18);

export function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Animated.View
        className='mb-3 h-14 w-14 items-center justify-center rounded-xl bg-stone-100 dark:bg-stone-700'
        entering={anim(0)}
      >
        <Search color='#a8a29e' size={28} strokeWidth={1.5} />
      </Animated.View>
      <Animated.Text entering={anim(60)} style={styles.emptyStateTitle}>
        No emojis found
      </Animated.Text>
      <Animated.Text entering={anim(120)} style={styles.emptyStateSubtitle}>
        Try a different search term
      </Animated.Text>
    </View>
  );
}
