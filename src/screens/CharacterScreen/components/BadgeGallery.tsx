/**
 * BadgeGallery — Full badge gallery with category filters and progress summary.
 *
 * Replaces the old "Recent Achievements" section in CharacterScreen
 * with a rich badge gallery showing all 18 badges organized by category.
 */

import { useState, useMemo } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { useThemeColors } from '../../../theme/ThemeContext';
import { useAchievements } from '../../../features/achievements';
import { BadgeCard } from './BadgeCard';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'streak', label: '🔥 Streaks' },
  { key: 'completion', label: '✅ Completions' },
  { key: 'collection', label: '📚 Collection' },
  { key: 'timing', label: '⏰ Timing' },
  { key: 'mastery', label: '⭐ Mastery' },
  { key: 'special', label: '✨ Special' },
] as const;

interface BadgeGalleryProps {
  isPremiumUser?: boolean;
}

export function BadgeGallery({ isPremiumUser = false }: BadgeGalleryProps) {
  const { colors, isDark } = useThemeColors();
  const { badges, unlockedCount, totalCount, isLoading } = useAchievements();
  const [activeCategory, setActiveCategory] = useState('all');

  const filteredBadges = useMemo(() => {
    if (!badges) return [];
    if (activeCategory === 'all') return badges;
    return badges.filter((b) => b.badge.category === activeCategory);
  }, [badges, activeCategory]);

  // Sort: unlocked first, then by progress descending
  const sortedBadges = useMemo(() => {
    return [...filteredBadges].sort((a, b) => {
      if (a.unlocked && !b.unlocked) return -1;
      if (!a.unlocked && b.unlocked) return 1;
      return b.progress - a.progress;
    });
  }, [filteredBadges]);

  if (isLoading) {
    return (
      <View className="mb-8 items-center justify-center py-8">
        <Text style={{ fontSize: 13, color: colors.text.tertiary }}>
          Loading badges…
        </Text>
      </View>
    );
  }

  return (
    <View className="mb-8 flex-col gap-3">
      {/* Section Header */}
      <Animated.View
        entering={FadeInDown.delay(580).springify().damping(18)}
        className="flex-row items-center justify-between px-1"
      >
        <Text
          className="font-semibold"
          style={{ fontSize: 17, letterSpacing: -0.41, lineHeight: 22, color: colors.text.primary }}
        >
          Achievement Badges
        </Text>
        <Text style={{ fontSize: 13, color: colors.text.secondary }}>
          {unlockedCount}/{totalCount}
        </Text>
      </Animated.View>

      {/* Progress Bar */}
      <Animated.View
        entering={FadeInDown.delay(620).springify().damping(18)}
        className="mx-1 h-2 overflow-hidden rounded-full"
        style={{ backgroundColor: isDark ? colors.gray[200] : colors.gray[200] }}
      >
        <Animated.View
          entering={FadeIn.delay(800).duration(600)}
          className="h-full rounded-full"
          style={{
            width: `${totalCount > 0 ? (unlockedCount / totalCount) * 100 : 0}%`,
            backgroundColor: colors.primary[600],
          }}
        />
      </Animated.View>

      {/* Category Chips */}
      <Animated.View entering={FadeInDown.delay(660).springify().damping(18)}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingHorizontal: 4, paddingVertical: 4 }}
        >
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <Pressable
                key={cat.key}
                onPress={() => setActiveCategory(cat.key)}
                className="rounded-xl px-3 py-1.5"
                style={{
                  backgroundColor: isActive
                    ? colors.primary[600]
                    : isDark ? colors.gray[100] : colors.gray[50],
                  borderWidth: 1,
                  borderColor: isActive ? colors.primary[600] : colors.cardBorder,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: isActive ? '#FFFFFF' : colors.text.secondary,
                  }}
                >
                  {cat.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </Animated.View>

      {/* Badge Grid */}
      <View className="flex-row flex-wrap justify-between gap-y-3 px-1" style={{ gap: 8 }}>
        {sortedBadges.map((badge, index) => (
          <BadgeCard
            key={badge.badge.id}
            data={badge}
            delay={700 + index * 40}
            isPremiumUser={isPremiumUser}
          />
        ))}
      </View>

      {/* Next Badge Hint */}
      {badges && (() => {
        const nextBadge = badges
          .filter((b) => !b.unlocked && (!b.badge.premium || isPremiumUser))
          .sort((a, b) => b.progress - a.progress)[0];
        if (!nextBadge) return null;
        return (
          <Animated.View
            entering={FadeInDown.delay(900).springify().damping(18)}
            className="mx-1 mt-1 flex-row items-center gap-3 rounded-2xl border px-4 py-3"
            style={{
              backgroundColor: isDark ? colors.gray[100] : colors.gray[50],
              borderColor: colors.cardBorder,
            }}
          >
            <Text style={{ fontSize: 20 }}>{nextBadge.badge.icon}</Text>
            <View className="flex-1">
              <Text style={{ fontSize: 13, fontWeight: '600', color: colors.text.primary }}>
                Next: {nextBadge.badge.name}
              </Text>
              <Text style={{ fontSize: 13, color: colors.text.tertiary }}>
                {nextBadge.badge.description} — {Math.round(nextBadge.progress * 100)}% complete
              </Text>
            </View>
          </Animated.View>
        );
      })()}
    </View>
  );
}
