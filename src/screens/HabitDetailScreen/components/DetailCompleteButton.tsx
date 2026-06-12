/** DetailCompleteButton - Full-width complete-today toggle under the hero. */
import { Check } from 'lucide-react-native';
import { Pressable, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { durations } from '../../../theme/animations';
import { borderRadius, spacing } from '../../../theme/spacing';
import { fontWeights, typography } from '../../../theme/typography';
import { useThemeColors } from '../../../theme';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { useDetailCompleteButtonAnimation } from './DetailCompleteButton.hooks';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

/** Button-only dimensions with no shared token equivalent. */
const INDICATOR_SIZE = 24;

interface DetailCompleteButtonProps {
  disabled?: boolean;
  isCompletedToday: boolean;
  onPress: () => void;
}

export function DetailCompleteButton({
  disabled = false,
  isCompletedToday,
  onPress,
}: DetailCompleteButtonProps) {
  const { colors } = useThemeColors();
  const reduceMotion = useReduceMotion();
  const { checkStyle, circleStyle, containerStyle, filledCircleStyle, pressHandlers } =
    useDetailCompleteButtonAnimation(isCompletedToday, {
      primaryBg: colors.text.primary,
      successBg: colors.status.success,
    });

  const labelEnter = reduceMotion ? undefined : FadeIn.duration(durations.quick);
  const labelExit = reduceMotion ? undefined : FadeOut.duration(durations.quick);

  return (
    <AnimatedPressable
      accessibilityLabel={
        isCompletedToday
          ? 'Completed today, tap to undo'
          : 'Mark complete for today'
      }
      accessibilityRole='button'
      className='flex-row items-center justify-center'
      disabled={disabled}
      style={[
        containerStyle,
        {
          borderRadius: borderRadius.large,
          gap: spacing.sm + spacing.xs,
          marginHorizontal: spacing.base + spacing.xs,
          marginTop: spacing.base,
          opacity: disabled ? 0.6 : 1,
          paddingVertical: spacing.base - 2,
        },
      ]}
      onPress={onPress}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
    >
      <View
        style={{
          alignItems: 'center',
          height: INDICATOR_SIZE,
          justifyContent: 'center',
          width: INDICATOR_SIZE,
        }}
      >
        <Animated.View
          style={[
            circleStyle,
            {
              borderColor: colors.text.inverse,
              borderRadius: borderRadius.full,
              borderWidth: 2,
              height: INDICATOR_SIZE,
              opacity: 0.7,
              position: 'absolute',
              width: INDICATOR_SIZE,
            },
          ]}
        />
        <Animated.View
          style={[
            filledCircleStyle,
            {
              alignItems: 'center',
              backgroundColor: colors.text.inverse,
              borderRadius: borderRadius.full,
              height: INDICATOR_SIZE,
              justifyContent: 'center',
              position: 'absolute',
              width: INDICATOR_SIZE,
            },
          ]}
        >
          <Animated.View style={checkStyle}>
            <Check color={colors.status.success} size={15} strokeWidth={3.5} />
          </Animated.View>
        </Animated.View>
      </View>
      <Animated.Text
        key={isCompletedToday ? 'done' : 'pending'}
        entering={labelEnter}
        exiting={labelExit}
        style={{
          ...typography.body,
          color: colors.text.inverse,
          fontWeight: fontWeights.semibold,
        }}
      >
        {isCompletedToday ? 'Completed Today' : 'Complete Today'}
      </Animated.Text>
    </AnimatedPressable>
  );
}
