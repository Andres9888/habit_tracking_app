import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { Achievement } from '../types';

interface AchievementCardProps {
  achievement: Achievement;
  delay?: number;
}

export function AchievementCard({
  achievement,
  delay = 0,
}: AchievementCardProps) {
  const { colors, isDark } = useThemeColors();

  return (
    <Animated.View
      accessible
      accessibilityLabel={`Achievement: ${achievement.title}. ${achievement.description}`}
      entering={FadeInDown.delay(delay).springify().damping(18)}
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        paddingHorizontal: 24,
        paddingVertical: 24,
        shadowColor: isDark ? '#000' : '#1c1917',
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: isDark ? 0.3 : 0.08,
        shadowRadius: 16,
        elevation: 3,
      }}
    >
      <View style={{
        height: 48, width: 48, alignItems: 'center', justifyContent: 'center',
        borderRadius: 24, backgroundColor: isDark ? 'rgba(245, 158, 11, 0.15)' : '#fff7ed',
      }}>
        <Text style={{ fontSize: 24 }}>{achievement.icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontWeight: '600', fontSize: 17, letterSpacing: -0.41, lineHeight: 22, color: colors.text.primary }}>
          {achievement.title}
        </Text>
        <Text style={{ fontSize: 13, letterSpacing: -0.08, lineHeight: 18, color: colors.text.secondary }}>
          {achievement.description}
        </Text>
      </View>
    </Animated.View>
  );
}
