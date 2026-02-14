import { StyleSheet } from 'react-native';

import { borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import type { SemanticColors } from '../../theme/darkColors';

export const DISMISS_THRESHOLD = 50;

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

/** Theme-aware colors for the delete toast */
export function deleteToastColors(isDark: boolean, colors: SemanticColors) {
  // Red palette adjusted for dark mode
  const redBg = isDark ? '#450a0a' : '#fee2e2'; // red-950 / red-100
  const redBorder = isDark ? '#7f1d1d' : '#fecaca'; // red-900 / red-200
  const redAccent = isDark ? '#f87171' : '#dc2626'; // red-400 / red-600
  const redBgHover = isDark ? '#7f1d1d' : '#fecaca'; // red-900 / red-200

  return {
    iconBg: redBg,
    iconColor: redAccent,
    itemNameColor: colors.text.primary,
    messageColor: colors.text.tertiary,
    progressBar: redAccent,
    progressBg: redBg,
    shadowColor: isDark ? '#000000' : '#dc2626',
    toastBg: colors.card,
    toastBorder: redBorder,
    undoBg: redBg,
    undoBgPressed: redBgHover,
    undoColor: redAccent,
  };
}

// Legacy export for tests — maps to layoutStyles
export const styles = layoutStyles;
