/**
 * Header for browse view mode
 * OPTIMIZED: FadeInDown stagger, type scale 28/17
 */

import { View } from 'react-native';
import Animated, {
  FadeInDown,
  type AnimatedStyle,
} from 'react-native-reanimated';
import { styles } from '../../templates/templatesScreenStyles';

interface BrowseHeaderProps {
  animatedStyle: AnimatedStyle;
}

export function BrowseHeader({ animatedStyle }: BrowseHeaderProps) {
  return (
    <Animated.View style={[styles.header, animatedStyle]}>
      <View>
        <Animated.Text
          entering={FadeInDown.delay(0).springify().damping(18)}
          style={{
            color: '#1c1917',
            fontSize: 28,
            fontWeight: '700',
            letterSpacing: 0.36,
            lineHeight: 34,
          }}
        >
          Import Habits
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(50).springify().damping(18)}
          style={{
            color: '#78716c',
            fontSize: 17,
            letterSpacing: -0.41,
            lineHeight: 22,
            marginTop: 4,
          }}
        >
          Science-backed habits to get you started
        </Animated.Text>
      </View>
    </Animated.View>
  );
}
