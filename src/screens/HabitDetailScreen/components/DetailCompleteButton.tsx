/** Full-width Chain Day primary action; tapping Completed also undoes today. */
import { Check } from 'lucide-react-native';
import { Pressable, Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { fontWeights, typography } from '../../../theme/typography';
import { spacing } from '../../../theme/spacing';
import { colors as palette } from '../../../theme/colors';
import { useThemeColors } from '../../../theme';
import { useDetailCompleteButtonAnimation } from './DetailCompleteButton.hooks';
import { styles } from './DetailCompleteButton.styles';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const AnimatedText = Animated.createAnimatedComponent(Text);

interface DetailCompleteButtonProps {
  disabled?: boolean;
  isCompletedToday: boolean;
  onPress: () => void;
}

/**
 * Chain Day primary control.
 * Rest: filled forest-green button, white "Complete today" + check (tactile press).
 * Done: settles to a light card with a green outline + green "Completed".
 */
export function DetailCompleteButton({
  disabled = false,
  isCompletedToday,
  onPress,
}: DetailCompleteButtonProps) {
  const { colors, isDark } = useThemeColors();
  const { containerStyle, labelStyle, pressHandlers } =
    useDetailCompleteButtonAnimation(isCompletedToday, {
      doneBg: isDark ? colors.card : palette.light.cardElevated,
      doneBorder: colors.primary[600],
      doneText: colors.primary[700],
      restBg: colors.primary[600],
      restBorder: colors.primary[600],
      restText: colors.text.inverse,
    });

  const label = isCompletedToday ? 'Completed' : 'Complete today';
  const checkColor = isCompletedToday
    ? colors.primary[700]
    : colors.text.inverse;

  return (
    <AnimatedPressable
      accessibilityLabel={
        isCompletedToday ? 'Completed today, tap to undo' : 'Complete today'
      }
      accessibilityRole='button'
      accessibilityState={{ checked: isCompletedToday }}
      className='flex-row items-center justify-center'
      disabled={disabled}
      style={[
        containerStyle,
        styles.container,
        { gap: spacing.sm, opacity: disabled ? 0.6 : 1 },
      ]}
      onPress={onPress}
      onPressIn={pressHandlers.onPressIn}
      onPressOut={pressHandlers.onPressOut}
    >
      <Check color={checkColor} size={18} strokeWidth={2.6} />
      <AnimatedText
        maxFontSizeMultiplier={2}
        style={[
          typography.button,
          labelStyle,
          { fontWeight: fontWeights.bold },
        ]}
      >
        {label}
      </AnimatedText>
    </AnimatedPressable>
  );
}
