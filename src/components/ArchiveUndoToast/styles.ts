/**
 * ArchiveUndoToast Styles
 */

import { StyleSheet } from 'react-native';

import { borderRadius, shadows } from '../../theme/spacing';
import { typography } from '../../theme/typography';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
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
  habitName: {
    color: '#1c1917', // stone-900 - matches app text
    fontWeight: '600',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#fef3c7', // amber-100 - warm and matches swipe
    borderRadius: borderRadius.medium,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  message: {
    flex: 1,
    fontSize: typography.bodySmall.fontSize,
  },
  messageText: {
    color: '#78716c', // stone-500 - warm gray
  },
  progressBar: {
    backgroundColor: '#d97706', // amber-600 - slightly deeper
    height: '100%',
  },
  progressContainer: {
    backgroundColor: '#fef3c7', // amber-100
    borderBottomLeftRadius: borderRadius.xl,
    borderBottomRightRadius: borderRadius.xl,
    height: 3,
    overflow: 'hidden',
    width: '100%',
  },
  toast: {
    backgroundColor: colors.light.card, // white - matches habit cards
    borderColor: '#f5f5f4', // stone-100 - matches card borders
    borderRadius: borderRadius.xl, // matches card rounded-3xl
    borderWidth: 1,
    ...shadows.alert,
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#78716c', // stone-500 - warm shadow
    width: '100%',
  },
  undoButton: {
    alignItems: 'center',
    backgroundColor: '#fef3c7', // amber-100
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  undoButtonPressed: {
    backgroundColor: '#fde68a', // amber-200
  },
  undoText: {
    color: '#b45309', // amber-700 - richer contrast
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
