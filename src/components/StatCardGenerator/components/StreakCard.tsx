/**
 * StreakCard — "30 Day Streak 🔥"
 *
 * Showcases the user's best current habit streaks with a bold flame motif.
 * Rendered inside a ViewShot for image capture.
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  VARIANT_GRADIENTS,
  VARIANT_TEXT_COLORS,
  CARD_WIDTH,
  CARD_HEIGHT,
  APP_NAME,
} from '../StatCardGenerator.constants';
import type { StreakCardProps } from '../StatCardGenerator.types';

export function StreakCard({ data, variant, userName }: StreakCardProps) {
  const gradientColors = VARIANT_GRADIENTS[variant] as unknown as readonly [
    string,
    string,
    ...string[],
  ];
  const tc = VARIANT_TEXT_COLORS[variant];

  const formationPct = Math.min(100, Math.max(0, data.formationProgress));

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradientColors}
        end={{ x: 0.3, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      {/* ── Top accent ring (decorative) ─────────────────────────────── */}
      <View style={[styles.accentRing, { borderColor: tc.accent + '30' }]} />

      <View style={styles.content}>
        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: tc.badgeBg }]}>
            <Text style={[styles.badgeText, { color: tc.badge }]}>
              🔥 STREAK REPORT
            </Text>
          </View>
        </View>

        {/* ── Hero stat: best streak ──────────────────────────────────── */}
        <View style={styles.heroSection}>
          <Text style={[styles.heroEmoji]}>{data.bestHabitEmoji}</Text>
          <Text style={[styles.heroNumber, { color: tc.primary }]}>
            {data.bestStreak}
          </Text>
          <Text style={[styles.heroUnit, { color: tc.secondary }]}>
            DAY STREAK
          </Text>
          <Text style={[styles.heroHabitName, { color: tc.accent }]}>
            {data.bestHabitName}
          </Text>
        </View>

        {/* ── Formation progress bar ──────────────────────────────────── */}
        <View style={styles.progressSection}>
          <View style={styles.progressLabelRow}>
            <Text style={[styles.progressLabel, { color: tc.secondary }]}>
              Habit Formation Journey
            </Text>
            <Text style={[styles.progressPct, { color: tc.accent }]}>
              {formationPct}%
            </Text>
          </View>
          <View
            style={[
              styles.progressTrack,
              { backgroundColor: tc.accent + '25' },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                { backgroundColor: tc.accent, width: `${formationPct}%` },
              ]}
            />
            {/* 66-day milestone marker */}
            <View
              style={[
                styles.milestoneMarker,
                { backgroundColor: tc.primary + 'CC' },
              ]}
            />
          </View>
          <Text style={[styles.progressSub, { color: tc.secondary }]}>
            66 days to automatic · {data.activeStreakCount} habits on a roll
          </Text>
        </View>

        {/* ── Top habits leaderboard ──────────────────────────────────── */}
        {data.topHabits.length > 1 && (
          <View style={styles.leaderboard}>
            {data.topHabits.slice(1, 3).map((h, idx) => (
              <View
                key={h.name}
                style={[
                  styles.leaderboardRow,
                  { backgroundColor: tc.badgeBg },
                ]}
              >
                <Text style={styles.leaderboardRank}>#{idx + 2}</Text>
                <Text style={styles.leaderboardEmoji}>{h.emoji}</Text>
                <Text
                  numberOfLines={1}
                  style={[styles.leaderboardName, { color: tc.primary }]}
                >
                  {h.name}
                </Text>
                <Text style={[styles.leaderboardStreak, { color: tc.accent }]}>
                  {h.currentStreak}d
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Footer ─────────────────────────────────────────────────── */}
        <View style={styles.footer}>
          <Text style={[styles.footerApp, { color: tc.secondary }]}>
            {APP_NAME}
          </Text>
          {userName ? (
            <Text style={[styles.footerUser, { color: tc.secondary }]}>
              @{userName}
            </Text>
          ) : null}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  accentRing: {
    borderRadius: CARD_WIDTH,
    borderWidth: 120,
    bottom: -CARD_WIDTH * 0.15,
    height: CARD_WIDTH * 0.85,
    position: 'absolute',
    right: -CARD_WIDTH * 0.25,
    width: CARD_WIDTH * 0.85,
  },
  badge: {
    borderRadius: 40,
    paddingHorizontal: 28,
    paddingVertical: 12,
  },
  badgeText: {
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 72,
  },
  footer: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  footerApp: {
    fontSize: 24,
    fontWeight: '600',
  },
  footerUser: {
    fontSize: 22,
    fontWeight: '400',
  },
  header: {
    alignItems: 'flex-start',
  },
  heroEmoji: {
    fontSize: 140,
    lineHeight: 160,
    textAlign: 'center',
  },
  heroHabitName: {
    fontSize: 36,
    fontWeight: '600',
    letterSpacing: -0.5,
    marginTop: 12,
    textAlign: 'center',
  },
  heroNumber: {
    fontSize: 200,
    fontWeight: '900',
    letterSpacing: -8,
    lineHeight: 200,
    textAlign: 'center',
  },
  heroSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  heroUnit: {
    fontSize: 36,
    fontWeight: '700',
    letterSpacing: 4,
    marginTop: -8,
    textAlign: 'center',
  },
  leaderboard: {
    gap: 16,
  },
  leaderboardEmoji: {
    fontSize: 36,
    marginRight: 16,
  },
  leaderboardName: {
    flex: 1,
    fontSize: 28,
    fontWeight: '500',
  },
  leaderboardRank: {
    color: '#9CA3AF',
    fontSize: 24,
    fontWeight: '700',
    marginRight: 16,
    width: 52,
  },
  leaderboardRow: {
    alignItems: 'center',
    borderRadius: 20,
    flexDirection: 'row',
    paddingHorizontal: 28,
    paddingVertical: 20,
  },
  leaderboardStreak: {
    fontSize: 28,
    fontWeight: '700',
  },
  milestoneMarker: {
    bottom: 0,
    height: '100%',
    left: '66%',
    position: 'absolute',
    width: 4,
  },
  progressFill: {
    borderRadius: 8,
    height: '100%',
  },
  progressLabel: {
    fontSize: 24,
    fontWeight: '500',
  },
  progressLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  progressPct: {
    fontSize: 24,
    fontWeight: '700',
  },
  progressSection: {},
  progressSub: {
    fontSize: 20,
    marginTop: 12,
  },
  progressTrack: {
    borderRadius: 8,
    height: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  root: {
    height: CARD_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
    width: CARD_WIDTH,
  },
});
