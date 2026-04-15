/**
 * StepProgressBar — 3-segment progress indicator for onboarding steps.
 */

import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

import { useThemeColors } from '../../../theme/ThemeContext';
import { durations } from '../../../theme/animations';
import { styles } from './StepProgressBar.styles';

interface StepProgressBarProps {
  currentStep: number;
  totalSteps: number;
}

export function StepProgressBar({
  currentStep,
  totalSteps,
}: StepProgressBarProps) {
  const { colors } = useThemeColors();

  return (
    <View
      accessible
      accessibilityLabel={`Step ${currentStep + 1} of ${totalSteps}`}
      accessibilityRole="progressbar"
      style={styles.container}
    >
      {Array.from({ length: totalSteps }, (_, i) => (
        <SegmentBar
          key={i}
          active={i <= currentStep}
          activeColor={colors.primary[600]}
          inactiveColor={colors.gray[200]}
        />
      ))}
    </View>
  );
}

function SegmentBar({
  active,
  activeColor,
  inactiveColor,
}: {
  active: boolean;
  activeColor: string;
  inactiveColor: string;
}) {
  const animatedStyle = useAnimatedStyle(() => ({
    backgroundColor: withTiming(active ? activeColor : inactiveColor, {
      duration: durations.standard,
    }),
  }));

  return <Animated.View style={[styles.bar, animatedStyle]} />;
}
