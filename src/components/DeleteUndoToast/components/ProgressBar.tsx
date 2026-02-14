import { View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import { useThemeColors } from '../../../theme/ThemeContext';
import { layoutStyles, deleteToastColors } from '../styles';

interface ProgressBarProps {
  progressStyle: AnimatedStyle;
}

/**
 * Animated progress bar showing countdown to deletion — dark mode aware
 */
export function ProgressBar({ progressStyle }: ProgressBarProps) {
  const { colors, isDark } = useThemeColors();
  const tc = deleteToastColors(isDark, colors);

  return (
    <View style={[layoutStyles.progressContainer, { backgroundColor: tc.progressBg }]}>
      <Animated.View style={[layoutStyles.progressBar, { backgroundColor: tc.progressBar }, progressStyle]} />
    </View>
  );
}
