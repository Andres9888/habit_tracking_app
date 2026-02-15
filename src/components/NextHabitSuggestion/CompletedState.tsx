import React, { useMemo } from 'react';
import { Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { createStyles } from './styles';
import { useThemeColors } from '../../theme/ThemeContext';

interface CompletedStateProps {
  totalCount: number;
}

export function CompletedState({ totalCount }: CompletedStateProps) {
  const { colors, isDark } = useThemeColors();
  const styles = useMemo(() => createStyles(colors, isDark), [colors, isDark]);

  return (
    <Animated.View
      entering={FadeInDown.duration(280).springify().damping(18)}
      style={styles.completedContainer}
    >
      <Text style={styles.completedEmoji}>🎉</Text>
      <Text style={styles.completedTitle}>All done for today!</Text>
      <Text style={styles.completedSubtitle}>
        {totalCount} habit{totalCount === 1 ? '' : 's'} completed
      </Text>
    </Animated.View>
  );
}
