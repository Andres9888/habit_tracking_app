/** PausedEmptyState - Empty state for paused habits, respects reduce-motion */
import { Text } from 'react-native';
import Animated from 'react-native-reanimated';
import { useThemeColors } from '../../theme/ThemeContext';
import { useReducedMotionEntry } from '../EmptyState/useReducedMotionEntry';

export function PausedEmptyState() {
  const { colors } = useThemeColors();
  const { entry } = useReducedMotionEntry();

  return (
    <Animated.View
      accessible
      accessibilityLabel='No paused habits. Paused habits will appear here.'
      accessibilityRole='text'
      entering={entry(60)}
      style={{ alignItems: 'center', gap: 12, paddingVertical: 48 }}
    >
      <Text style={{ fontSize: 48 }}>⏸️</Text>
      <Text
        style={{
          color: colors.text.primary,
          fontSize: 22,
          fontWeight: '600',
          letterSpacing: -0.35,
        }}
      >
        No paused habits
      </Text>
      <Text
        style={{
          color: colors.text.secondary,
          fontSize: 17,
          lineHeight: 22,
        }}
      >
        Paused habits will appear here
      </Text>
    </Animated.View>
  );
}
