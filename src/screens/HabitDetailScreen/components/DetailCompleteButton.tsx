/** DetailCompleteButton - Full-width complete-today toggle under the hero. */
import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { durations } from '../../../theme/animations';
import { fontWeights, typography } from '../../../theme/typography';
import { useThemeColors } from '../../../theme';
import { useReduceMotion } from '../../../hooks/useReduceMotion';
import { useDetailCompleteButtonAnimation } from './DetailCompleteButton.hooks';
import { styles } from './DetailCompleteButton.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedText = Animated.createAnimatedComponent(Text);

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
  const {
    checkStyle,
    circleStyle,
    containerStyle,
    filledCircleStyle,
    labelStyle,
    pressHandlers,
  } = useDetailCompleteButtonAnimation(isCompletedToday, {
    inverseText: colors.text.inverse,
    successBg: colors.status.success,
    successBorder: colors.status.success,
    successText: colors.status.success,
  });

  const labelEnter = reduceMotion ? undefined : FadeIn.duration(durations.quick);
  const labelExit = reduceMotion ? undefined : FadeOut.duration(durations.quick);
  const label = isCompletedToday ? 'Done for Today' : 'Mark as done';

  return (
    <AnimatedPressable
      accessibilityLabel={
        isCompletedToday
          ? 'Done for today, tap to undo'
          : 'Mark as done for today'
      }
      accessibilityRole='button'
      className='flex-row items-center justify-center'
      disabled={disabled}
      style={[containerStyle, styles.container, { opacity: disabled ? 0.6 : 1 }]}
      onPress={onPress}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
    >
      <View style={styles.indicatorWrap}>
        <Animated.View style={[circleStyle, styles.ring]} />
        <Animated.View
          style={[
            filledCircleStyle,
            styles.filledCircle,
            { backgroundColor: colors.text.inverse },
          ]}
        >
          <Animated.View style={checkStyle}>
            <Check color={colors.status.success} size={15} strokeWidth={3.5} />
          </Animated.View>
        </Animated.View>
      </View>
      <AnimatedText
        key={isCompletedToday ? 'done' : 'pending'}
        entering={labelEnter}
        exiting={labelExit}
        style={[
          typography.body,
          labelStyle,
          { fontWeight: fontWeights.semibold },
        ]}
      >
        {label}
      </AnimatedText>
    </AnimatedPressable>
  );
}
