/**
 * Badge and pill styles for TemplateScienceModal hero section
 */

import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';

/** "Popular" badge colors (orange palette, not part of core tokens) */
const POPULAR_BADGE_BG = '#FFF7ED'; // orange-50
const POPULAR_BADGE_BORDER = '#FFEDD5'; // orange-100

export const badgeStyles = StyleSheet.create({
  popularBadge: {
    alignItems: 'center',
    backgroundColor: POPULAR_BADGE_BG,
    borderColor: POPULAR_BADGE_BORDER,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    bottom: -4,
    height: 28,
    justifyContent: 'center',
    position: 'absolute',
    right: -4,
    width: 28,
  },
  readingTimePill: {
    alignItems: 'center',
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  readingTimePillText: {
    color: colors.gray[500],
    fontSize: 13,
    fontWeight: '600',
  },
  templateHeader: {
    alignItems: 'center',
  },
  templateName: {
    color: colors.gray[900],
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.5,
    textAlign: 'center',
  },
});
