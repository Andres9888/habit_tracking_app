/** PausedEmptyState - Empty state for paused habits */

import { Text } from 'react-native';

import Animated, { FadeInDown } from 'react-native-reanimated';

import { useThemeColors } from '../../theme/ThemeContext';

const anim = FadeInDown.duration(280).delay(60).springify().damping(18);

export function PausedEmptyState() {
  const { colors } = useThemeColors();

  return (
    <Animated.View
      entering={anim}
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
