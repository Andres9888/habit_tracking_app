/**
 * ArchiveUndoToast Styles — dark mode aware
 */

import { StyleSheet } from 'react-native';

import { borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { SemanticColors } from '../../theme/darkColors';

/** Static layout styles (color-independent) */
export const layoutStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    left: 20,
    position: 'absolute',
    right: 20,
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  message: {
    flex: 1,
    fontSize: typography.bodySmall.fontSize,
  },
  progressBar: {
    height: '100%',
  },
  progressContainer: {
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    height: 3,
    overflow: 'hidden',
    width: '100%',
  },
  toast: {
    borderRadius: borderRadius.xl,
    borderWidth: 1,
    ...shadows.alert,
    maxWidth: 400,
    overflow: 'hidden',
    width: '100%',
  },
  undoButton: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  undoText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

/** Theme-aware colors for the archive toast */
export function archiveToastColors(isDark: boolean, colors: SemanticColors) {
  // Amber palette adjusted for dark mode
  const amberBg = isDark ? '#451a03' : '#fef3c7'; // amber-950 / amber-100
  const amberBorder = isDark ? '#78350f' : '#f5f5f4'; // amber-900 / stone-100
  const amberAccent = isDark ? '#fbbf24' : '#b45309'; // amber-400 / amber-700
  const amberDeep = isDark ? '#f59e0b' : '#d97706'; // amber-500 / amber-600
  const amberBgHover = isDark ? '#78350f' : '#fde68a'; // amber-900 / amber-200

  return {
    iconBg: amberBg,
    iconColor: amberAccent,
    habitNameColor: colors.text.primary,
    messageColor: colors.text.tertiary,
    progressBar: amberDeep,
    progressBg: amberBg,
    shadowColor: isDark ? '#000000' : '#78716c',
    toastBg: colors.card,
    toastBorder: amberBorder,
    undoBg: amberBg,
    undoBgPressed: amberBgHover,
    undoColor: amberAccent,
  };
}

// Legacy export for tests
export const styles = layoutStyles;
