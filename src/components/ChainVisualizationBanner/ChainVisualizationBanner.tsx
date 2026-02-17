/* eslint-disable max-lines */
/**
 * ChainVisualizationBanner
 *
 * Prominent habit chain visualization for the HabitDetailScreen.
 * Shows the last 28 days as an animated chain — the core metaphor of the app.
 *
 * ┌──────────────────────────────────────────────────────────┐
 * │  🔗  YOUR CHAIN                               🔥 14 days │
 * │                                                          │
 * │  ●═●═●═●  💔  ●═●═●═●═●═●═●═●═●═●═●═●═●═●             │
 * │       ↑repair             thicker & shinier →           │
 * └──────────────────────────────────────────────────────────┘
 *
 * Features:
 * - Each completed day = an animated SVG chain link
 * - Link weight (size + connector thickness) grows with streak
 * - Broken chain gap shows a "REPAIR" CTA for recent misses
 * - Shimmer animation on links when streak ≥ 7
 * - Spring bounce when a new link is added
 * - Horizontal scroll for all 28 days
 */

import React, { useCallback, useRef, useEffect } from 'react';
import {
  Animated,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import ReAnimated, { FadeInDown } from 'react-native-reanimated';

import { useChainVisualizationBanner } from './ChainVisualizationBanner.hooks';
import { ChainLinkNode } from './ChainLinkNode';
import { ChainBreak } from './ChainBreak';
import {
  getConnectorHeight,
  getConnectorOpacity,
  CHAIN_BANNER_DAYS,
} from './chainBannerUtils';
import type { ChainDayStatus } from './chainBannerUtils';
import { useThemeColors } from '../../theme';

interface ChainVisualizationBannerProps {
  completedDates: Set<string>;
  habitCreatedAt?: number;
  accentColor: string;
  habitName?: string;
  /** Called when user taps "REPAIR" on a gap */
  onRepairGap?: (missedDateString: string) => void;
  reduceMotion?: boolean;
}

// ─── Streak badge helpers ────────────────────────────────────────────────────

function getStreakEmoji(streak: number): string {
  if (streak >= 365) return '👑';
  if (streak >= 100) return '💎';
  if (streak >= 30)  return '⚡';
  if (streak >= 14)  return '🔥';
  if (streak >= 7)   return '✨';
  if (streak >= 3)   return '🌱';
  if (streak === 0)  return '💤';
  return '🔗';
}

function getStreakLabel(streak: number): string {
  if (streak === 0) return 'Start your chain!';
  if (streak === 1) return '1 day — link forged!';
  return `${streak} day streak`;
}

// ─── Connector between two chain links ──────────────────────────────────────

interface ConnectorBarProps {
  /** run-length of the link on the left */
  runLength: number;
  accentColor: string;
  shimmerPosition: Animated.Value;
  hasShimmer: boolean;
}

const ConnectorBar: React.FC<ConnectorBarProps> = React.memo(({
  runLength,
  accentColor,
  shimmerPosition,
  hasShimmer,
}) => {
  const height = getConnectorHeight(runLength);
  const opacity = getConnectorOpacity(runLength);
  const shimmerTranslate = shimmerPosition.interpolate({
    inputRange: [0, 1],
    outputRange: [-20, 20],
  });

  return (
    <View
      style={{
        alignSelf: 'center',
        backgroundColor: accentColor,
        borderRadius: height / 2,
        height,
        marginBottom: 12, // push up to link-center level
        opacity,
        overflow: 'hidden',
        width: 10,
      }}
    >
      {hasShimmer && (
        <Animated.View
          pointerEvents='none'
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(255,255,255,0.35)',
            transform: [{ translateX: shimmerTranslate }],
            width: 8,
          }}
        />
      )}
    </View>
  );
});
ConnectorBar.displayName = 'ConnectorBar';

// ─── Main component ──────────────────────────────────────────────────────────

export const ChainVisualizationBanner: React.FC<ChainVisualizationBannerProps> = ({
  completedDates,
  habitCreatedAt,
  accentColor,
  habitName,
  onRepairGap,
  reduceMotion = false,
}) => {
  const { colors, isDark } = useThemeColors();
  const cardBg = isDark ? colors.card : '#FFFFFF';
  const labelColor = isDark ? colors.text.tertiary : '#9C958D';
  const borderColor = isDark ? colors.border : '#E8E4DF';
  const shadowColor = isDark ? '#000' : '#1c1917';

  const scrollRef = useRef<ScrollView>(null);

  const {
    chainDays,
    currentStreak,
    gaps,
    hasShimmer,
    shimmerPosition,
    linkScales,
    linkOpacities,
  } = useChainVisualizationBanner({
    completedDates,
    habitCreatedAt,
    accentColor,
    reduceMotion,
  });

  // Auto-scroll to end so "today" is visible
  useEffect(() => {
    const timeout = setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: false });
    }, 50);
    return () => clearTimeout(timeout);
  }, []);

  // Build a Set of gap indices for quick lookup
  const gapIndexSet = new Set<number>();
  for (const [start, end] of gaps) {
    for (let i = start; i <= end; i++) gapIndexSet.add(i);
  }

  // Build gap-start lookup: index → gap size (only at gap start)
  const gapStartMap = new Map<number, number>();
  for (const [start, end] of gaps) {
    gapStartMap.set(start, end - start + 1);
  }

  const handleRepairGap = useCallback(
    (dateString: string) => {
      onRepairGap?.(dateString);
    },
    [onRepairGap],
  );

  // Determine if a gap is recent (within last 7 days = repairable)
  const isGapRepairable = useCallback(
    (gapStartIdx: number) => gapStartIdx >= CHAIN_BANNER_DAYS - 8,
    [],
  );

  const streakEmoji = getStreakEmoji(currentStreak);
  const streakLabel = getStreakLabel(currentStreak);

  return (
    <ReAnimated.View
      entering={reduceMotion ? undefined : FadeInDown.delay(60).springify().damping(18)}
    >
      <View
        style={{
          backgroundColor: cardBg,
          borderRadius: 16,
          elevation: 4,
          paddingBottom: 16,
          paddingTop: 14,
          shadowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 16,
        }}
      >
        {/* ── Header row ── */}
        <View
          style={{
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginBottom: 14,
            paddingHorizontal: 16,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Text style={{ fontSize: 15 }}>🔗</Text>
            <Text
              style={{
                color: isDark ? colors.text.primary : '#1c1917',
                fontSize: 14,
                fontWeight: '700',
                letterSpacing: 0.5,
              }}
            >
              {habitName ? `${habitName.toUpperCase()} CHAIN` : 'YOUR CHAIN'}
            </Text>
          </View>

          {/* Streak badge */}
          <View
            style={{
              alignItems: 'center',
              backgroundColor: currentStreak > 0
                ? `${accentColor}18`
                : (isDark ? '#2a2825' : '#f5f3f1'),
              borderColor: currentStreak > 0 ? `${accentColor}40` : borderColor,
              borderRadius: 20,
              borderWidth: 1,
              flexDirection: 'row',
              gap: 4,
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
            accessibilityLabel={streakLabel}
          >
            <Text style={{ fontSize: 13 }}>{streakEmoji}</Text>
            <Text
              style={{
                color: currentStreak > 0 ? accentColor : labelColor,
                fontSize: 13,
                fontWeight: '700',
              }}
            >
              {currentStreak > 0 ? `${currentStreak}d` : '0d'}
            </Text>
          </View>
        </View>

        {/* ── Chain row (scrollable) ── */}
        <ScrollView
          ref={scrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, alignItems: 'flex-end' }}
          bounces={false}
        >
          {chainDays.map((day, idx) => {
            const isGapStart = gapStartMap.has(idx);
            const gapSize = gapStartMap.get(idx) ?? 0;
            const isGap = gapIndexSet.has(idx);

            // Skip rendering missed days that aren't gap-start (gap-start renders them all)
            if (isGap && !isGapStart) return null;

            // Determine if this link connects to previous (show connector between them)
            const prevDay = idx > 0 ? chainDays[idx - 1] : null;
            const showConnector =
              prevDay?.status === 'completed' &&
              day.status === 'completed' &&
              !isGap;

            const prevRunLength = prevDay?.runLength ?? 0;

            return (
              <React.Fragment key={day.dateString}>
                {/* Connector from previous completed link */}
                {showConnector && (
                  <ConnectorBar
                    accentColor={accentColor}
                    hasShimmer={hasShimmer}
                    runLength={prevRunLength}
                    shimmerPosition={shimmerPosition}
                  />
                )}

                {/* Gap break visualization */}
                {isGapStart && (
                  <>
                    {/* small gap connector (dashed) */}
                    {prevDay?.status === 'completed' && (
                      <View
                        style={{
                          alignSelf: 'center',
                          backgroundColor: '#d4d0cb',
                          borderRadius: 1,
                          height: 2,
                          marginBottom: 12,
                          opacity: 0.5,
                          width: 8,
                        }}
                      />
                    )}
                    <ChainBreak
                      accentColor={accentColor}
                      gapSize={gapSize}
                      isRepairable={isGapRepairable(idx)}
                      reduceMotion={reduceMotion}
                      onRepair={
                        isGapRepairable(idx)
                          ? () => handleRepairGap(day.dateString)
                          : undefined
                      }
                    />
                    {/* small connector out of gap */}
                    {idx + gapSize < chainDays.length &&
                      chainDays[idx + gapSize]?.status === 'completed' && (
                        <View
                          style={{
                            alignSelf: 'center',
                            backgroundColor: '#d4d0cb',
                            borderRadius: 1,
                            height: 2,
                            marginBottom: 12,
                            opacity: 0.5,
                            width: 8,
                          }}
                        />
                      )}
                  </>
                )}

                {/* Chain link node */}
                {!isGap && (
                  <ChainLinkNode
                    accentColor={accentColor}
                    dayLabel={day.dayLabel}
                    hasShimmer={hasShimmer}
                    isToday={day.isToday}
                    opacityAnim={linkOpacities[idx]}
                    reduceMotion={reduceMotion}
                    runLength={day.runLength}
                    scaleAnim={linkScales[idx]}
                    shimmerPosition={shimmerPosition}
                    status={day.status}
                  />
                )}
              </React.Fragment>
            );
          })}
        </ScrollView>

        {/* ── Footer hint ── */}
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Text
            style={{
              color: labelColor,
              fontSize: 11,
              fontStyle: 'italic',
              textAlign: 'center',
            }}
          >
            {currentStreak === 0
              ? 'Complete today to forge your first link ⚡'
              : currentStreak < 7
              ? 'Links grow stronger with every day 💪'
              : currentStreak < 30
              ? 'Your chain is forging — keep going! 🔥'
              : 'Legendary chain — you\'re unstoppable! 👑'}
          </Text>
        </View>
      </View>
    </ReAnimated.View>
  );
};

export default ChainVisualizationBanner;
