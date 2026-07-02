/**
 * GoalWhyAnchor — Surfaces the user's own motivation above the goal card.
 * Renders nothing when no why / identity / woopWish is set.
 */
import { Text, View } from 'react-native';
import Animated, { Easing, FadeInDown } from 'react-native-reanimated';
import { durations } from '../../../../theme/animations';
import { useThemeColors } from '../../../../theme';
import {
  typography,
  fontFamilies,
  fontWeights,
} from '../../../../theme/typography';
import type { Habit } from '../../../../features/habits/types';
import { useResolveWhy } from './GoalWhyAnchor.hooks';

interface GoalWhyAnchorProps {
  habit: Habit;
}

const WHY_ICON_SIZE = 18;
/** Serif quote sized between bodySmall (14) and body (17) — no token equivalent. */
const WHY_QUOTE_SIZE = 15;
const WHY_QUOTE_LINE = 21;

export function GoalWhyAnchor({ habit }: GoalWhyAnchorProps) {
  const { colors } = useThemeColors();
  const resolved = useResolveWhy(habit);
  if (resolved === null) return null;

  return (
    <Animated.View
      accessibilityLabel={`${resolved.label}: ${resolved.value}`}
      accessibilityRole='summary'
      className='mx-0 mb-3 flex-row items-start gap-3 rounded-2xl px-4 py-3.5'
      entering={FadeInDown.duration(durations.enter).easing(
        Easing.out(Easing.cubic)
      )}
      style={{
        backgroundColor: colors.background,
        borderColor: colors.border,
        borderWidth: 1,
      }}
    >
      <View
        className='h-9 w-9 items-center justify-center rounded-[10px]'
        style={{ backgroundColor: colors.card }}
      >
        <Text style={{ fontSize: WHY_ICON_SIZE }}>{resolved.icon}</Text>
      </View>
      <View className='flex-1'>
        <Text
          style={{
            ...typography.caption,
            color: colors.text.tertiary,
            fontWeight: fontWeights.bold,
            letterSpacing: 0.6,
            textTransform: 'uppercase',
          }}
        >
          {resolved.label}
        </Text>
        <Text
          className='mt-0.5'
          style={{
            ...typography.bodySmall,
            color: colors.text.primary,
            fontFamily: fontFamilies.primary.display,
            fontSize: WHY_QUOTE_SIZE,
            fontStyle: 'italic',
            lineHeight: WHY_QUOTE_LINE,
          }}
        >
          “{resolved.value}”
        </Text>
      </View>
    </Animated.View>
  );
}
