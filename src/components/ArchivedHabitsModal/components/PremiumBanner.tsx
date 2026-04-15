import { Text, View } from 'react-native';
import { useThemeColors } from '@/theme';
import { typography } from '@/theme/typography';
import { spacing } from '@/theme/spacing';

export function PremiumBanner() {
  const { isDark } = useThemeColors();

  return (
    <View
      style={{
        alignSelf: 'stretch',
        marginTop: spacing.xl,
        padding: spacing.base,
        borderRadius: 14,
        backgroundColor: isDark ? 'rgba(139,92,246,0.1)' : '#F5F3FF',
        borderWidth: 1,
        borderColor: isDark ? 'rgba(139,92,246,0.2)' : '#DDD6FE',
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
      }}
    >
      <Text style={{ fontSize: 22 }}>🛡️</Text>
      <View style={{ flex: 1 }}>
        <Text
          style={{
            ...typography.bodySmall,
            fontWeight: '600',
            color: isDark ? '#C4B5FD' : '#5B21B6',
          }}
        >
          Streak Protection
        </Text>
        <Text
          style={{
            ...typography.caption,
            color: isDark ? '#A78BFA' : '#6D28D9',
          }}
        >
          Premium freezes streaks while archived
        </Text>
      </View>
    </View>
  );
}
