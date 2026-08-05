/**
 * Styles for TemplateAddedCelebration full-screen overlay
 */

import { Dimensions, StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { borderRadius } from '@/theme/spacing';
import { fontFamilies, fontWeights, typography } from '@/theme/typography';

const { width: SCREEN_W } = Dimensions.get('window');

export const celebrationStyles = StyleSheet.create({
  actionSecondary: {
    alignItems: 'center',
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: borderRadius.full,
    borderWidth: 1.5,
    marginTop: 12,
    paddingHorizontal: 48,
    paddingVertical: 14,
    width: SCREEN_W - 96,
  },
  actionSecondaryText: {
    ...typography.bodySmall,
    color: colors.gray[500],
    fontWeight: fontWeights.semibold,
  },
  actions: {
    alignItems: 'center',
    marginTop: 36,
    width: '100%',
  },
  checkBadge: {
    alignItems: 'center',
    backgroundColor: colors.primary[500],
    borderColor: colors.gray[900],
    borderRadius: borderRadius.card,
    borderWidth: 3,
    bottom: 2,
    height: 32,
    justifyContent: 'center',
    position: 'absolute',
    right: 2,
    width: 32,
  },
  container: {
    ...StyleSheet.absoluteFill,
    zIndex: 9999,
  },
  glowRing: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: 120,
    justifyContent: 'center',
    width: 120,
  },
  iconEmoji: {
    fontSize: 56,
  },
  overlay: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 28,
  },
  primaryBtn: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    paddingHorizontal: 48,
    paddingVertical: 16,
    width: SCREEN_W - 96,
  },
  primaryBtnText: {
    ...typography.button,
    color: colors.text.inverse,
  },
  subtitle: {
    ...typography.bodySmall,
    color: colors.gray[500],
    lineHeight: 22,
    marginTop: 8,
    textAlign: 'center',
  },
  title: {
    ...typography.heading2,
    color: colors.text.inverse,
    fontWeight: fontWeights.bold,
    marginTop: 28,
    textAlign: 'center',
  },
});
