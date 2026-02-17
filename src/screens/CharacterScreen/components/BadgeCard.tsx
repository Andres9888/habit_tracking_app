/**
 * BadgeCard — Individual achievement badge with progress ring and unlock state.
 *
 * Design system compliant:
 * - Typography: 13px caption, 17px body
 * - Border radius: 16px
 * - Shadows: 4px offset, 16px blur, 0.08 opacity
 * - Animations: springify().damping(18)
 */

import { View, Text } from 'react-native';
import Animated, { FadeInDown, ZoomIn } from 'react-native-reanimated';
import { Lock } from 'lucide-react-native';
import { useThemeColors } from '../../../theme/ThemeContext';
import type { BadgeData } from '../../../features/achievements';

interface BadgeCardProps {
  data: BadgeData;
  delay?: number;
  isPremiumUser?: boolean;
}

const TIER_LIGHT = {
  bronze: { bg: '#FEF3C7', ring: '#D97706' },
  silver: { bg: '#F3F4F6', ring: '#9CA3AF' },
  gold: { bg: '#FEF9C3', ring: '#EAB308' },
  platinum: { bg: '#EDE9FE', ring: '#8B5CF6' },
} as const;

const TIER_DARK = {
  bronze: { bg: '#451A03', ring: '#D97706' },
  silver: { bg: '#1F2937', ring: '#6B7280' },
  gold: { bg: '#422006', ring: '#EAB308' },
  platinum: { bg: '#2E1065', ring: '#8B5CF6' },
} as const;

export function BadgeCard({ data, delay = 0, isPremiumUser = false }: BadgeCardProps) {
  const { colors, isDark } = useThemeColors();
  const { badge, unlocked, progress, current } = data;
  const tierColors = isDark
    ? TIER_DARK[badge.tier as keyof typeof TIER_DARK]
    : TIER_LIGHT[badge.tier as keyof typeof TIER_LIGHT];

  const isLocked = badge.premium && !isPremiumUser && !unlocked;
  const showProgress = !unlocked && !isLocked;
  const progressPercent = Math.round(progress * 100);

  return (
    <Animated.View
      entering={FadeInDown.delay(delay).springify().damping(18)}
      className="items-center rounded-2xl border p-3"
      style={{
        backgroundColor: unlocked ? tierColors.bg : colors.card,
        borderColor: unlocked ? tierColors.ring : colors.cardBorder,
        opacity: isLocked ? 0.5 : 1,
        shadowColor: colors.text.primary,
        shadowOffset: { height: 4, width: 0 },
        shadowOpacity: unlocked ? 0.12 : 0.04,
        shadowRadius: 16,
        width: '30%',
      }}
    >
      {/* Badge Icon */}
      <View className="mb-2 h-12 w-12 items-center justify-center rounded-full" style={{
        backgroundColor: unlocked
          ? `${tierColors.ring}20`
          : isDark ? colors.gray[100] : colors.gray[50],
      }}>
        {isLocked ? (
          <Lock color={colors.text.tertiary} size={20} />
        ) : unlocked ? (
          <Animated.Text
            entering={ZoomIn.delay(delay + 100).springify().damping(14)}
            style={{ fontSize: 24 }}
          >
            {badge.icon}
          </Animated.Text>
        ) : (
          <Text style={{ fontSize: 24, opacity: 0.4 }}>{badge.icon}</Text>
        )}
      </View>

      {/* Name */}
      <Text
        numberOfLines={1}
        style={{
          fontSize: 13,
          fontWeight: '600',
          letterSpacing: -0.08,
          lineHeight: 18,
          color: unlocked ? colors.text.primary : colors.text.secondary,
          textAlign: 'center',
        }}
      >
        {isLocked ? '???' : badge.name}
      </Text>

      {/* Progress or ✓ */}
      {unlocked ? (
        <Text style={{ fontSize: 11, color: tierColors.ring, fontWeight: '700', marginTop: 2 }}>
          ✓ Unlocked
        </Text>
      ) : showProgress ? (
        <Text style={{ fontSize: 11, color: colors.text.tertiary, marginTop: 2 }}>
          {current}/{badge.threshold} ({progressPercent}%)
        </Text>
      ) : (
        <Text style={{ fontSize: 11, color: colors.text.tertiary, marginTop: 2 }}>
          Premium ✦
        </Text>
      )}
    </Animated.View>
  );
}
