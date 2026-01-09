import { View } from 'react-native';
import Animated from 'react-native-reanimated';

import { styles } from '../styles';

interface ProgressBarProps {
  progressStyle: ReturnType<typeof Animated.useAnimatedStyle>;
}

/**
 * Animated progress bar showing countdown to deletion
 */
export function ProgressBar({ progressStyle }: ProgressBarProps) {
  return (
    <View style={styles.progressContainer}>
      <Animated.View style={[styles.progressBar, progressStyle]} />
    </View>
  );
}
