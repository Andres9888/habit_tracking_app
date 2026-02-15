/**
 * NetworkErrorBanner Styles
 *
 * Warm stone design system, consistent with OfflineIndicator.
 */

import { StyleSheet } from 'react-native';
import { typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  actions: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  container: {
    alignItems: 'center',
    backgroundColor: '#fef2f2', // red-50
    borderColor: '#fecaca', // red-200
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  containerDark: {
    alignItems: 'center',
    backgroundColor: '#1c1917', // stone-900
    borderColor: '#44403c', // stone-700
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 16,
    marginVertical: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },

  content: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 8,
  },

  dismissButton: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },

  message: {
    flex: 1,
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
  },

  retryButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },

  retryText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
  },
});
