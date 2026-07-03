/** DetailCompleteButton - Fused full-width complete-today pill inside the hero card. */
import { Check } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { durations } from '../../../theme/animations';
import { fontWeights, typography } from '../../../theme/typography';
import { withAlpha } from '../../../theme/colors';
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
  const { checkStyle, containerStyle, labelStyle, pressHandlers } =
    useDetailCompleteButtonAnimation(isCompletedToday, {
      doneBg: colors.primary[100],
      doneBorder: withAlpha(colors.primary[700], 0.25),
      doneText: colors.primary[700],
      filledBg: colors.primary[600],
      filledText: colors.text.inverse,
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
      style={[
        containerStyle,
        styles.container,
        { shadowColor: colors.primary[600], opacity: disabled ? 0.6 : 1 },
      ]}
      onPress={onPress}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
    >
      {isCompletedToday ? (
        <Animated.View style={checkStyle}>
          <Check color={colors.primary[700]} size={17} strokeWidth={2.6} />
        </Animated.View>
      ) : null}
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
