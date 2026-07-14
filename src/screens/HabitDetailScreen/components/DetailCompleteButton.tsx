/**
 * DetailCompleteButton — C1 "Settled" full-width bar inside the hero card.
 * Rest: outlined bar with an empty check-well waiting to be filled.
 * Done: settles into a deep fill; the well flips to a medallion with a check.
 * onPress fires in both states, but the caller (useCompleteHandlers) makes
 * it one-way: a press while done re-offers Undo in a toast rather than
 * un-marking directly, so a second tap can't silently erase a completion.
 */
import { Check } from 'lucide-react-native';
import { Pressable, Text, View } from 'react-native';
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
  const { checkStyle, containerStyle, labelStyle, pressHandlers, wellStyle } =
    useDetailCompleteButtonAnimation(isCompletedToday, {
      doneBg: colors.primary[700],
      doneText: colors.text.inverse,
      restBg: colors.card,
      restBorder: colors.primary[600],
      restText: colors.primary[700],
      wellDoneBg: colors.card,
      wellRestBg: withAlpha(colors.card, 0),
      wellRestRing: withAlpha(colors.primary[600], 0.45),
    });

  const labelEnter = reduceMotion
    ? undefined
    : FadeIn.duration(durations.quick);
  const labelExit = reduceMotion
    ? undefined
    : FadeOut.duration(durations.quick);
  const label = isCompletedToday ? 'Done today' : 'Mark as done';

  return (
    <AnimatedPressable
      accessibilityLabel={
        isCompletedToday
          ? 'Done today, double tap for the undo option'
          : 'Mark as done for today'
      }
      accessibilityRole='button'
      accessibilityState={{ checked: isCompletedToday }}
      className='flex-row items-center'
      disabled={disabled}
      style={[
        containerStyle,
        styles.container,
        { opacity: disabled ? 0.6 : 1 },
      ]}
      onPress={onPress}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
    >
      <Animated.View style={[styles.well, wellStyle]}>
        <Animated.View style={checkStyle}>
          <Check color={colors.primary[700]} size={15} strokeWidth={3} />
        </Animated.View>
      </Animated.View>
      <AnimatedText
        key={isCompletedToday ? 'done' : 'pending'}
        entering={labelEnter}
        exiting={labelExit}
        maxFontSizeMultiplier={2}
        style={[
          typography.body,
          styles.label,
          labelStyle,
          { fontWeight: fontWeights.semibold },
        ]}
      >
        {label}
      </AnimatedText>
      <View style={styles.wellBalance} />
    </AnimatedPressable>
  );
}
