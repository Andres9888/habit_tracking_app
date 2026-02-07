/**
 * SyncedToast Styles
 *
 * Success-themed styling for the sync completion toast.
 * Uses green tones to indicate successful sync completion.
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';
import { typography } from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#f0fdf4', // green-50 - soft success background
    borderColor: '#86efac', // green-300 - visible border
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  countText: {
    color: '#166534', // green-800
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
  },

  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#dcfce7', // green-100
    borderRadius: borderRadius.medium,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },

  text: {
    color: '#166534', // green-800
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export const ICON_SIZE = 12;
export const ICON_COLOR = '#16a34a'; // green-600
