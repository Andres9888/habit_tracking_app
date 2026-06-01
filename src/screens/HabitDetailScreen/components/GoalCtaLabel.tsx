/**
 * GoalCtaLabel — primary-button label that springs into place whenever the
 * selected preset changes, so the fixed-width CTA gets a subtle "settle" instead
 * of an abrupt text swap. Rendered as a non-string Button child, so it carries
 * the primary button text style itself (17px semibold, inverse/white).
 */
import { useEffect, useRef } from 'react';
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { typography } from '../../../theme/typography';
import { springs } from '../../../theme/animations';

interface GoalCtaLabelProps {
  label: string;
  /** Drives the animation — pass the selected duration so each change re-springs. */
  trigger: number;
}

export function GoalCtaLabel({ label, trigger }: GoalCtaLabelProps) {
  const { colors } = useThemeColors();
  const progress = useSharedValue(1);
  const firstRun = useRef(true);

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false;
      return;
    }
    progress.value = 0;
    progress.value = withSpring(1, springs.gentle);
  }, [trigger, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.3, 1]),
    transform: [{ translateY: interpolate(progress.value, [0, 1], [6, 0]) }],
  }));

  return (
    <Animated.Text
      maxFontSizeMultiplier={2}
      style={[typography.button, { color: colors.text.inverse }, animatedStyle]}
    >
      {label}
    </Animated.Text>
  );
}
