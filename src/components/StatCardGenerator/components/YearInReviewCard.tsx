/**
 * YearInReviewCard — "Year in Review 🌟"
 *
 * A full-year retrospective: total days tracked, habits formed,
 * average completion, and the longest streak achieved.
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
import type { YearInReviewCardProps } from '../StatCardGenerator.types';

export function YearInReviewCard({
  data,
  variant,
  userName,
}: YearInReviewCardProps) {
  const gradientColors = VARIANT_GRADIENTS[variant] as unknown as readonly [
    string,
    string,
    ...string[],
  ];
  const tc = VARIANT_TEXT_COLORS[variant];

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradientColors}
        end={{ x: 1, y: 0 }}
        start={{ x: 0, y: 1 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Bottom-left decorative arc */}
      <View style={[styles.arc, { borderColor: tc.accent + '18' }]} />

      <View style={styles.content}>
        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: tc.badgeBg }]}>
            <Text style={[styles.badgeText, { color: tc.badge }]}>
              🌟 YEAR IN REVIEW
            </Text>
          </View>
          <Text style={[styles.yearLabel, { color: tc.primary }]}>
            {data.year}
          </Text>
        </View>

        {/* ── Primary stat: days tracked ──────────────────────────────── */}
        <View style={styles.primaryStat}>
          <Text style={[styles.primaryNumber, { color: tc.accent }]}>
            {data.daysTracked}
          </Text>
          <Text style={[styles.primaryUnit, { color: tc.primary }]}>
            DAYS TRACKED
          </Text>
          <View
            style={[styles.divider, { backgroundColor: tc.accent + '40' }]}
          />
          <Text style={[styles.primarySub, { color: tc.secondary }]}>
            {data.totalCompletions.toLocaleString()} total habit completions
          </Text>
        </View>

        {/* ── Secondary stats row ─────────────────────────────────────── */}
        <View style={styles.secondaryRow}>
          <SecondaryStat
            accent={tc.accent}
            bg={tc.badgeBg}
            label={'Habits\nFormed'}
            primary={tc.primary}
            secondary={tc.secondary}
            value={String(data.habitsFormed)}
          />
          <SecondaryStat
            accent={tc.accent}
            bg={tc.badgeBg}
            label={'Avg\nCompletion'}
            primary={tc.primary}
            secondary={tc.secondary}
            value={`${data.averageCompletionRate}%`}
          />
          <SecondaryStat
            accent={tc.accent}
            bg={tc.badgeBg}
            label={'Best\nStreak'}
            primary={tc.primary}
            secondary={tc.secondary}
            value={`${data.longestStreak}d`}
          />
        </View>

        {/* ── Best streak highlight ───────────────────────────────────── */}
        {data.longestStreakHabit ? (
          <View
            style={[
              styles.streakHighlight,
              { backgroundColor: tc.badgeBg, borderColor: tc.accent + '30' },
            ]}
          >
            <Text style={[styles.streakHighlightLabel, { color: tc.secondary }]}>
              🏆 Longest streak
            </Text>
            <Text
              numberOfLines={1}
              style={[styles.streakHighlightHabit, { color: tc.primary }]}
            >
              {data.longestStreakHabit} · {data.longestStreak} days in a row
            </Text>
          </View>
        ) : null}

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

// ---------------------------------------------------------------------------
// Secondary stat tile
// ---------------------------------------------------------------------------

interface SecondaryStatProps {
  value: string;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
}

function SecondaryStat({
  value,
  label,
  primary,
  secondary,
  accent,
  bg,
}: SecondaryStatProps) {
  return (
    <View style={[secondaryStat.root, { backgroundColor: bg }]}>
      <Text style={[secondaryStat.value, { color: accent }]}>{value}</Text>
      <Text style={[secondaryStat.label, { color: secondary }]}>{label}</Text>
    </View>
  );
}

const secondaryStat = StyleSheet.create({
  label: {
    fontSize: 22,
    fontWeight: '500',
    marginTop: 10,
    textAlign: 'center',
  },
  root: {
    alignItems: 'center',
    borderRadius: 24,
    flex: 1,
    justifyContent: 'center',
    margin: 10,
    paddingVertical: 40,
  },
  value: {
    fontSize: 64,
    fontWeight: '900',
    letterSpacing: -2,
    textAlign: 'center',
  },
});

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  arc: {
    borderRadius: CARD_WIDTH,
    borderWidth: 100,
    bottom: -CARD_WIDTH * 0.3,
    height: CARD_WIDTH * 0.75,
    left: -CARD_WIDTH * 0.2,
    position: 'absolute',
    width: CARD_WIDTH * 0.75,
  },
  badge: {
    alignSelf: 'flex-start',
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
  divider: {
    height: 3,
    marginVertical: 24,
    width: '40%',
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
    gap: 16,
  },
  primaryNumber: {
    fontSize: 180,
    fontWeight: '900',
    letterSpacing: -8,
    lineHeight: 180,
    textAlign: 'center',
  },
  primaryStat: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  primarySub: {
    fontSize: 26,
    fontWeight: '400',
    textAlign: 'center',
  },
  primaryUnit: {
    fontSize: 34,
    fontWeight: '800',
    letterSpacing: 4,
    textAlign: 'center',
  },
  root: {
    height: CARD_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
    width: CARD_WIDTH,
  },
  secondaryRow: {
    flexDirection: 'row',
    marginHorizontal: -10,
  },
  streakHighlight: {
    borderRadius: 24,
    borderWidth: 1,
    paddingHorizontal: 36,
    paddingVertical: 28,
  },
  streakHighlightHabit: {
    fontSize: 30,
    fontWeight: '600',
    letterSpacing: -0.5,
    marginTop: 8,
  },
  streakHighlightLabel: {
    fontSize: 24,
    fontWeight: '500',
  },
  yearLabel: {
    fontSize: 80,
    fontWeight: '900',
    letterSpacing: -3,
    lineHeight: 80,
  },
});
