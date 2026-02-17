/**
 * MonthlyRecapCard — "Monthly Recap 📊"
 *
 * Visualises a month's worth of habit data: completion rate, perfect days,
 * total completions, best day of week, and active habit count.
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
import type { MonthlyRecapCardProps } from '../StatCardGenerator.types';

export function MonthlyRecapCard({
  data,
  variant,
  userName,
}: MonthlyRecapCardProps) {
  const gradientColors = VARIANT_GRADIENTS[variant] as unknown as readonly [
    string,
    string,
    ...string[],
  ];
  const tc = VARIANT_TEXT_COLORS[variant];

  const completedRadius = (data.completionRate / 100) * 2 * Math.PI * 160;
  const circumference = 2 * Math.PI * 160;

  return (
    <View style={styles.root}>
      <LinearGradient
        colors={gradientColors}
        end={{ x: 1, y: 1 }}
        start={{ x: 0, y: 0 }}
        style={StyleSheet.absoluteFill}
      />

      {/* Decorative circle (top-right) */}
      <View style={[styles.decorCircle, { borderColor: tc.accent + '20' }]} />

      <View style={styles.content}>
        {/* ── Header ─────────────────────────────────────────────────── */}
        <View style={styles.header}>
          <View style={[styles.badge, { backgroundColor: tc.badgeBg }]}>
            <Text style={[styles.badgeText, { color: tc.badge }]}>
              📊 MONTHLY RECAP
            </Text>
          </View>
          <Text style={[styles.monthLabel, { color: tc.primary }]}>
            {data.monthLabel}
          </Text>
        </View>

        {/* ── Ring + completion rate ──────────────────────────────────── */}
        <View style={styles.ringSection}>
          {/* We fake the ring with nested Views since SVG isn't used */}
          <View style={styles.ringWrapper}>
            <View
              style={[
                styles.ringOuter,
                { borderColor: tc.accent + '30' },
              ]}
            />
            {/* Filled arc simulated by a coloured border on one side */}
            <View
              style={[
                styles.ringFill,
                {
                  borderTopColor: tc.accent,
                  borderRightColor:
                    data.completionRate > 50 ? tc.accent : 'transparent',
                  borderBottomColor:
                    data.completionRate > 75 ? tc.accent : 'transparent',
                  borderLeftColor:
                    data.completionRate > 25 ? tc.accent : 'transparent',
                  transform: [
                    {
                      rotate: `${(data.completionRate / 100) * 360 - 90}deg`,
                    },
                  ],
                },
              ]}
            />
            <View style={styles.ringInner}>
              <Text style={[styles.ringPct, { color: tc.primary }]}>
                {data.completionRate}%
              </Text>
              <Text style={[styles.ringLabel, { color: tc.secondary }]}>
                completion
              </Text>
            </View>
          </View>
        </View>

        {/* ── Stats grid ─────────────────────────────────────────────── */}
        <View style={styles.statsGrid}>
          <StatTile
            accent={tc.accent}
            bg={tc.badgeBg}
            label='Completions'
            primary={tc.primary}
            secondary={tc.secondary}
            value={String(data.totalCompletions)}
          />
          <StatTile
            accent={tc.accent}
            bg={tc.badgeBg}
            label='Perfect Days'
            primary={tc.primary}
            secondary={tc.secondary}
            value={String(data.perfectDays)}
          />
          <StatTile
            accent={tc.accent}
            bg={tc.badgeBg}
            label='Habits Tracked'
            primary={tc.primary}
            secondary={tc.secondary}
            value={String(data.habitCount)}
          />
          <StatTile
            accent={tc.accent}
            bg={tc.badgeBg}
            label='Best Day'
            primary={tc.primary}
            secondary={tc.secondary}
            value={data.bestDayOfWeek.slice(0, 3).toUpperCase()}
          />
        </View>

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
// Stat tile sub-component
// ---------------------------------------------------------------------------

interface StatTileProps {
  value: string;
  label: string;
  primary: string;
  secondary: string;
  accent: string;
  bg: string;
}

function StatTile({ value, label, primary, secondary, bg }: StatTileProps) {
  return (
    <View style={[statTile.root, { backgroundColor: bg }]}>
      <Text style={[statTile.value, { color: primary }]}>{value}</Text>
      <Text style={[statTile.label, { color: secondary }]}>{label}</Text>
    </View>
  );
}

const statTile = StyleSheet.create({
  label: {
    fontSize: 22,
    fontWeight: '500',
    marginTop: 8,
    textAlign: 'center',
  },
  root: {
    alignItems: 'center',
    borderRadius: 24,
    flex: 1,
    justifyContent: 'center',
    margin: 10,
    paddingVertical: 36,
  },
  value: {
    fontSize: 60,
    fontWeight: '800',
    letterSpacing: -2,
    textAlign: 'center',
  },
});

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
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
  decorCircle: {
    borderRadius: CARD_WIDTH,
    borderWidth: 100,
    height: CARD_WIDTH * 0.7,
    position: 'absolute',
    right: -CARD_WIDTH * 0.25,
    top: -CARD_WIDTH * 0.2,
    width: CARD_WIDTH * 0.7,
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
    gap: 20,
  },
  monthLabel: {
    fontSize: 56,
    fontWeight: '800',
    letterSpacing: -2,
    lineHeight: 60,
  },
  ringFill: {
    borderRadius: 180,
    borderWidth: 20,
    height: 360,
    position: 'absolute',
    width: 360,
  },
  ringInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: {
    fontSize: 28,
    fontWeight: '500',
    letterSpacing: 1,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  ringOuter: {
    borderRadius: 180,
    borderWidth: 20,
    height: 360,
    position: 'absolute',
    width: 360,
  },
  ringPct: {
    fontSize: 110,
    fontWeight: '900',
    letterSpacing: -4,
    lineHeight: 110,
  },
  ringSection: {
    alignItems: 'center',
  },
  ringWrapper: {
    alignItems: 'center',
    height: 360,
    justifyContent: 'center',
    width: 360,
  },
  root: {
    height: CARD_HEIGHT,
    overflow: 'hidden',
    position: 'relative',
    width: CARD_WIDTH,
  },
  statsGrid: {
    flexDirection: 'row',
    marginHorizontal: -10,
  },
});
