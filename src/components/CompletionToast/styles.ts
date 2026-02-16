/**
 * CompletionToast Styles
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    left: 16,
    position: 'absolute',
    right: 16,
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  habitIcon: {
    fontSize: 24,
  },
  message: {
    flex: 1,
  },
  primaryText: {
    fontWeight: '600',
  },
  streakBadge: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  streakEmoji: {
    fontSize: 13,
  },
  streakText: {
    fontSize: 13,
    fontWeight: '700',
  },
  toast: {
    alignItems: 'center',
    borderRadius: 16,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    maxWidth: 400,
    paddingHorizontal: 16,
    paddingVertical: 14,
    width: '100%',
  },
});
