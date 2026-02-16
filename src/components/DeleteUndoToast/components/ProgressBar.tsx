import { View } from 'react-native';
import Animated, { type AnimatedStyle } from 'react-native-reanimated';

import { useToastStyles } from '../styles';

interface ProgressBarProps {
  progressStyle: AnimatedStyle;
}

/**
 * Animated progress bar showing countdown to deletion
 */
export function ProgressBar({ progressStyle }: ProgressBarProps) {
  const styles = useToastStyles();
  return (
    <View style={styles.progressContainer}>
      <Animated.View style={[styles.progressBar, progressStyle]} />
    </View>
  );
}
