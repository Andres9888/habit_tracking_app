/**
 * OfflineBanner Enhanced Styles (with Dark Mode)
 *
 * Design System:
 * - Typography: 13pt caption (design system locked)
 * - Border radius: 12px buttons (design system)
 * - Shadows: 4px offset, 16px blur, 0.08 opacity
 * - Primary green: #047857 (text), #059669 (buttons)
 */

import { StyleSheet } from 'react-native';
import { typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    // Shadow (4px offset, 16px blur, 0.08 opacity)
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
  },

  containerDark: {
    backgroundColor: '#1f2937', // gray-800
    shadowColor: '#000000',
    shadowOpacity: 0.3,
  },

  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },

  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fef2f2', // red-50 for offline
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainerDark: {
    backgroundColor: '#7f1d1d', // red-900
  },

  textContainer: {
    flex: 1,
    gap: 2,
  },

  mainText: {
    fontSize: typography.caption.fontSize, // 13pt
    fontWeight: '600',
    color: '#1f2937', // gray-800
    letterSpacing: 0.2,
  },

  mainTextDark: {
    color: '#f9fafb', // gray-50
  },

  countText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280', // gray-500
    letterSpacing: 0.1,
  },

  countTextDark: {
    color: '#9ca3af', // gray-400
  },

  syncButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#f0fdf4', // green-50
    alignItems: 'center',
    justifyContent: 'center',
  },

  syncButtonDark: {
    backgroundColor: '#064e3b', // green-900
  },
});
