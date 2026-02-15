import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { StatCardProps } from '../types';

export function StatCard({
  emoji,
  value,
  label,
  delay = 0,
}: StatCardProps & { delay?: number }) {
  const { colors, isDark } = useThemeColors();

  return (
    <Animated.View
      accessible
      accessibilityLabel={`${label}: ${value}`}
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={{
        flex: 1,
        alignItems: 'center',
        gap: 4,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        paddingHorizontal: 16,
        paddingVertical: 16,
        shadowColor: isDark ? '#000' : '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      <Text style={{ fontSize: 24, lineHeight: 32 }}>{emoji}</Text>
      <Text style={{ fontWeight: '600', fontSize: 17, letterSpacing: -0.41, lineHeight: 22, color: colors.text.primary }}>
        {value}
      </Text>
      <Text style={{ textAlign: 'center', fontSize: 13, letterSpacing: -0.08, lineHeight: 18, color: colors.text.secondary }}>
        {label}
      </Text>
    </Animated.View>
  );
}
