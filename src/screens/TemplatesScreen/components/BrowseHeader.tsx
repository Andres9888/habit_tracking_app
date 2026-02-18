/**
 * Header for browse view mode
 * OPTIMIZED: FadeInDown stagger, type scale 28/17
 */

import { View } from 'react-native';
import Animated, {
  FadeInDown,
  type AnimatedStyle,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { styles } from '../../templates/templatesScreenStyles';

interface BrowseHeaderProps {
  animatedStyle: AnimatedStyle;
}

export function BrowseHeader({ animatedStyle }: BrowseHeaderProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View style={[styles.header, animatedStyle]}>
      <View>
        <Animated.Text
          entering={FadeInDown.delay(0).springify().damping(18)}
          style={{
            color: colors.text.primary,
            fontSize: 28,
            fontWeight: '800',
            letterSpacing: -0.5,
            lineHeight: 34,
          }}
        >
          Import Habits
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(50).springify().damping(18)}
          style={{
            color: colors.text.secondary,
            fontSize: 17,
            letterSpacing: -0.41,
            lineHeight: 22,
            marginTop: 4,
          }}
        >
          Science-backed templates to build great habits
        </Animated.Text>
      </View>
    </Animated.View>
  );
}
