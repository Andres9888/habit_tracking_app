/**
 * Header for browse view mode
 * OPTIMIZED: FadeInDown stagger, type scale 22/14 (matches app H1)
 */

import { View } from 'react-native';
import Animated, {
  FadeInDown,
  type AnimatedStyle,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { fontFamilies } from '../../../theme/typography';
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
            fontFamily: fontFamilies.primary.display,
            fontSize: 22,
            fontWeight: '700',
            letterSpacing: -0.35,
            lineHeight: 28,
          }}
        >
          Import Habits
        </Animated.Text>
        <Animated.Text
          entering={FadeInDown.delay(50).springify().damping(18)}
          style={{
            color: colors.text.secondary,
            fontFamily: fontFamilies.primary.text,
            fontSize: 14,
            letterSpacing: -0.2,
            lineHeight: 20,
            marginTop: 2,
          }}
        >
          Science-backed templates to build great habits
        </Animated.Text>
      </View>
    </Animated.View>
  );
}
