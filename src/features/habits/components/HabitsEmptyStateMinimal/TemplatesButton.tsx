import { Pressable, Text, View } from 'react-native';
import Animated from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

import {
  badgeContainerStyle,
  badgeTextStyle,
  getTemplatesButtonStyle,
  templatesGradientStyle,
  templatesLabelStyle,
} from './InlineHint.styles';

interface TemplatesButtonProps {
  animatedStyle: ReturnType<
    typeof import('react-native-reanimated').useAnimatedStyle
  >;
  colors: {
    badgeBackground: string;
    ctaText: string;
    gradientColors: readonly [string, string, string];
  };
  onPress: () => void;
  onPressIn: () => void;
  onPressOut: () => void;
}

const pressableStyle = ({ pressed }: { pressed: boolean }) =>
  getTemplatesButtonStyle(pressed);

export function TemplatesButton({
  animatedStyle,
  colors,
  onPress,
  onPressIn,
  onPressOut,
}: TemplatesButtonProps) {
  return (
    <View style={{ width: '100%' }}>
      <Animated.View style={[{ width: '100%' }, animatedStyle]}>
        <Pressable
          accessibilityHint='Opens screen with pre-made habit templates'
          accessibilityLabel='Browse habit templates'
          accessibilityRole='button'
          style={pressableStyle}
          testID='inline-hint-browse-templates'
          onPress={onPress}
          onPressIn={onPressIn}
          onPressOut={onPressOut}
        >
          <LinearGradient
            colors={[...colors.gradientColors]}
            end={{ x: 1, y: 0.3 }}
            start={{ x: 0, y: 0 }}
            style={templatesGradientStyle}
          >
            <Text style={{ fontSize: 17 }}>📚</Text>
            <Text style={[templatesLabelStyle, { color: colors.ctaText }]}>
              browse templates
            </Text>
            <View
              style={badgeContainerStyle(
                colors.badgeBackground ?? 'rgba(255,255,255,0.22)'
              )}
              testID='inline-hint-badge'
            >
              <Text style={[badgeTextStyle, { color: colors.ctaText }]}>
                200+
              </Text>
            </View>
          </LinearGradient>
        </Pressable>
      </Animated.View>
    </View>
  );
}
