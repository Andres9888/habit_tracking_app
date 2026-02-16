/**
 * SuccessContent - Text and action content for success state
 *
 * Displays headline, first chain link visual, subtext, tap hint,
 * and add another button. Shows immediate value after first habit creation.
 */

import { Pressable, Text, View, ViewStyle } from 'react-native';
import Animated, { AnimatedStyle } from 'react-native-reanimated';

import { BORDER_RADIUS, COPY, TOUCH_TARGETS } from './constants';
import { useEmptyStateColors } from './useEmptyStateColors';

interface SuccessContentProps {
  habitName: string;
  autoTransition: boolean;
  contentStyle: AnimatedStyle<ViewStyle>;
  tapHintStyle: AnimatedStyle<ViewStyle>;
  onAddAnother: () => void;
}

/**
 * FirstChainLink - Visual "Day 1" chain link to show immediate value
 * Reinforces the core mechanic: don't break the chain!
 */
function FirstChainLink({ isDark }: { isDark: boolean }) {
  return (
    <View
      style={{
        alignItems: 'center',
        marginBottom: 16,
        marginTop: 4,
      }}
    >
      <View
        style={{
          alignItems: 'center',
          backgroundColor: isDark ? '#065F46' : '#D1FAE5',
          borderColor: isDark ? '#10B981' : '#059669',
          borderRadius: 12,
          borderWidth: 2,
          flexDirection: 'row',
          gap: 8,
          paddingHorizontal: 16,
          paddingVertical: 10,
        }}
      >
        <Text style={{ fontSize: 20 }}>🔗</Text>
        <View>
          <Text
            style={{
              color: isDark ? '#6EE7B7' : '#047857',
              fontSize: 15,
              fontWeight: '700',
            }}
          >
            Day 1 — Chain started!
          </Text>
          <Text
            style={{
              color: isDark ? '#A7F3D0' : '#059669',
              fontSize: 12,
              marginTop: 2,
            }}
          >
            Come back tomorrow to keep it growing 🌱
          </Text>
        </View>
      </View>
    </View>
  );
}

export function SuccessContent({
  habitName,
  autoTransition,
  contentStyle,
  tapHintStyle,
  onAddAnother,
}: SuccessContentProps) {
  const colors = useEmptyStateColors();

  return (
    <Animated.View
      style={[contentStyle, { alignItems: 'center', width: '100%' }]}
    >
      {/* Headline */}
      <Text
        style={{
          color: colors.textPrimary,
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
          color: colors.textSecondary,
          fontSize: 13,
          marginBottom: 12,
          textAlign: 'center',
        }}
      >
        {COPY.successSubtext(habitName)}
      </Text>

      {/* First chain link — immediate value visualization */}
      <FirstChainLink isDark={colors.isDark} />

      {/* Tap to continue hint - only show if auto-transitioning */}
      {autoTransition && (
        <Animated.Text
          style={[
            tapHintStyle,
            {
              color: colors.textSecondary,
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
            backgroundColor: colors.textPrimary,
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
              color: colors.isDark ? '#111827' : '#ffffff',
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
