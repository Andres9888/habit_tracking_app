/**
 * WorkshopSectionHeader - Unified section header for Workshop sections.
 *
 * Replaces 5 ad-hoc section headers with a consistent, theme-aware component.
 * Supports: emoji icon, title, accent color, PRO/PREMIUM badges, trailing actions,
 * and count indicators — all with dark mode support.
 *
 * @module MotivationSystem/Workshop/shared
 */

import React from 'react';
import { View, Text, type ViewStyle } from 'react-native';
import { Plus } from 'lucide-react-native';
import { useThemeColors } from '../../../../theme/ThemeContext';

/** Accent color presets mapping to light/dark values */
const ACCENT_PRESETS = {
  amber: { dark: '#FBBF24', light: '#D97706' },
  fuchsia: { dark: '#E879F9', light: '#C026D3' },
  stone: { dark: '#A8A29E', light: '#57534E' },
  teal: { dark: '#2DD4BF', light: '#0D9488' },
  violet: { dark: '#A78BFA', light: '#7C3AED' },
} as const;

type AccentPreset = keyof typeof ACCENT_PRESETS;

interface BadgeConfig {
  /** Badge label text (e.g. "PRO", "PREMIUM", "2/5") */
  label: string;
  /** Badge variant — 'pro' shows amber, 'premium' shows green, 'count' uses accent */
  variant: 'pro' | 'premium' | 'count';
}

interface TrailingAction {
  /** Action label (e.g. "Add", "Set up", "Record", "Write") */
  label: string;
  /** Optional icon component override (defaults to Plus) */
  icon?: React.ComponentType<{ size: number; color: string }>;
}

interface TrailingBadge {
  /** Badge text (e.g. "3 new", "Peak Motivation") */
  label: string;
  /** Whether to use filled style */
  filled?: boolean;
}

export interface WorkshopSectionHeaderProps {
  /** Emoji displayed before the title */
  emoji: string;
  /** Section title text */
  title: string;
  /** Accent color preset name */
  accent: AccentPreset;
  /** Optional badge after title (PRO, PREMIUM, count) */
  badge?: BadgeConfig;
  /** Trailing action button (shown when section is empty) */
  trailingAction?: TrailingAction;
  /** Trailing badge (shown when section has content) */
  trailingBadge?: TrailingBadge;
  /** Trailing count text like "3/10" */
  trailingCount?: string;
  /** Extra trailing content */
  trailingContent?: React.ReactNode;
  /** Container style override */
  style?: ViewStyle;
}

export function WorkshopSectionHeader({
  emoji,
  title,
  accent,
  badge,
  trailingAction,
  trailingBadge,
  trailingCount,
  trailingContent,
  style,
}: WorkshopSectionHeaderProps) {
  const { isDark } = useThemeColors();
  const accentColor = ACCENT_PRESETS[accent][isDark ? 'dark' : 'light'];

  return (
    <View
      style={[
        {
          alignItems: 'center',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 8,
        },
        style,
      ]}
    >
      {/* Leading: emoji + title + optional badge */}
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
        <Text style={{ fontSize: 16 }}>{emoji}</Text>
        <Text
          style={{
            color: accentColor,
            fontSize: 12,
            fontWeight: '600',
          }}
        >
          {title}
        </Text>
        {badge && <HeaderBadge badge={badge} isDark={isDark} />}
      </View>

      {/* Trailing: action, badge, count, or custom content */}
      <View style={{ alignItems: 'center', flexDirection: 'row', gap: 8 }}>
        {trailingContent}
        {trailingCount != null && (
          <Text
            style={{
              color: accentColor,
              fontSize: 12,
              fontWeight: '500',
            }}
          >
            {trailingCount}
          </Text>
        )}
        {trailingBadge && (
          <TrailingBadgeView
            accentColor={accentColor}
            badge={trailingBadge}
            isDark={isDark}
          />
        )}
        {trailingAction && (
          <TrailingActionView
            accentColor={accentColor}
            action={trailingAction}
          />
        )}
      </View>
    </View>
  );
}

/* ---- Sub-components ---- */

function HeaderBadge({
  badge,
  isDark,
}: {
  badge: BadgeConfig;
  isDark: boolean;
}) {
  const styles = {
    count: {
      bg: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.06)',
      text: isDark ? '#D1D5DB' : '#6B7280',
    },
    premium: {
      bg: isDark ? 'rgba(16,185,129,0.15)' : '#D1FAE5',
      text: isDark ? '#6EE7B7' : '#047857',
    },
    pro: {
      bg: isDark ? 'rgba(251,191,36,0.15)' : '#FEF3C7',
      text: isDark ? '#FBBF24' : '#B45309',
    },
  };

  const s = styles[badge.variant];

  return (
    <View
      style={{
        backgroundColor: s.bg,
        borderRadius: 999,
        paddingHorizontal: 6,
        paddingVertical: 2,
      }}
    >
      <Text style={{ color: s.text, fontSize: 9, fontWeight: '700' }}>
        {badge.label}
      </Text>
    </View>
  );
}

function TrailingActionView({
  action,
  accentColor,
}: {
  action: TrailingAction;
  accentColor: string;
}) {
  const IconComponent = action.icon ?? Plus;
  return (
    <View style={{ alignItems: 'center', flexDirection: 'row', gap: 4 }}>
      <IconComponent color={accentColor} size={12} />
      <Text style={{ color: accentColor, fontSize: 12, fontWeight: '500' }}>
        {action.label}
      </Text>
    </View>
  );
}

function TrailingBadgeView({
  badge,
  accentColor,
  isDark,
}: {
  badge: TrailingBadge;
  accentColor: string;
  isDark: boolean;
}) {
  if (badge.filled) {
    return (
      <View
        style={{
          backgroundColor: accentColor,
          borderRadius: 999,
          paddingHorizontal: 8,
          paddingVertical: 2,
        }}
      >
        <Text
          style={{
            color: isDark ? '#111827' : '#FFFFFF',
            fontSize: 10,
            fontWeight: '600',
          }}
        >
          {badge.label}
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        backgroundColor: isDark
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(0,0,0,0.04)',
        borderRadius: 999,
        paddingHorizontal: 8,
        paddingVertical: 2,
      }}
    >
      <Text style={{ color: accentColor, fontSize: 10, fontWeight: '600' }}>
        {badge.label}
      </Text>
    </View>
  );
}
