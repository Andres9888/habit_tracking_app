/**
 * SuccessContent - Text and action content for success state
 *
 * Displays headline, subtext, tap hint, and add another button.
 */

import { Pressable, Text, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';

import { BORDER_RADIUS, COLORS, COPY, TOUCH_TARGETS } from './constants';

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
  return (
    <Animated.View
      style={[contentStyle, { alignItems: 'center', width: '100%' }]}
    >
      {/* Headline */}
      <Text
        style={{
          color: COLORS.stone800,
          fontSize: 24,
          fontWeight: '700',
          marginBottom: 8,
          textAlign: 'center',
        }}
      >
        {COPY.successHeadline}
      </Text>

      {/* Subtext */}
      <Text
        style={{
          color: COLORS.stone500,
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
              color: COLORS.stone500,
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
            backgroundColor: COLORS.stone800,
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
              color: '#ffffff',
              fontSize: 15,
              fontWeight: '700',
            }}
          >
            {COPY.addAnother}
          </Text>
        </Pressable>
      )}
    </Animated.View>
  );
}
