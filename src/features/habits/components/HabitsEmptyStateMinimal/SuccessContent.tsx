/**
 * SuccessContent - Text and action content for success state
 *
 * Displays headline, subtext, tap hint, and add another button.
 */

import { Pressable, Text, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';

import { useThemeColors } from '@/theme/ThemeContext';
import { BORDER_RADIUS, COPY, TOUCH_TARGETS } from './constants';

interface SuccessContentProps {
  habitName: string;
  autoTransition: boolean;
  contentStyle: AnimatedStyle<ViewStyle>;
  tapHintStyle: AnimatedStyle<ViewStyle>;
  onAddAnother: () => void;
}

export function SuccessContent({
  habitName,
  autoTransition,
  contentStyle,
  tapHintStyle,
  onAddAnother,
}: SuccessContentProps) {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      style={[contentStyle, { alignItems: 'center', width: '100%' }]}
    >
      {/* Headline */}
      <Text
        style={{
          color: colors.text.primary,
          fontSize: 22,
          fontWeight: '600',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {COPY.successHeadline}
      </Text>

      {/* Subtext */}
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: 13,
          marginBottom: 24,
          textAlign: 'center',
        }}
      >
        {COPY.successSubtext(habitName)}
      </Text>

      {/* Tap to continue hint - only show if auto-transitioning */}
      {autoTransition && (
        <Animated.Text
          style={[
            tapHintStyle,
            {
              color: colors.text.secondary,
              fontSize: 13,
              textAlign: 'center',
            },
          ]}
        >
          Tap anywhere to continue
        </Animated.Text>
      )}

      {/* Add another button - only show if not auto-transitioning */}
      {!autoTransition && (
        <Pressable
          accessibilityHint='Creates another habit'
          accessibilityLabel={COPY.addAnother}
          accessibilityRole='button'
          style={({ pressed }) => ({
            alignItems: 'center',
            backgroundColor: colors.text.primary,
            borderRadius: BORDER_RADIUS.cta,
            height: TOUCH_TARGETS.ctaHeight,
            justifyContent: 'center',
            opacity: pressed ? 0.9 : 1,
            transform: [{ scale: pressed ? 0.98 : 1 }],
            width: '100%',
          })}
          onPress={onAddAnother}
        >
          <Text
            style={{
              color: colors.text.inverse,
              fontSize: 17,
              fontWeight: '600',
            }}
          >
            {COPY.addAnother}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
