/**
 * SyncedToast Styles
 *
 * Success-themed styling for the sync completion toast.
 * Uses green tones to indicate successful sync completion.
 */

import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { typography, fontWeights, fontFamilies} from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderColor: colors.primary[300],
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  countText: {
    color: colors.success,
    fontFamily: fontFamilies.monospace,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.medium,
  },

  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderRadius: borderRadius.medium,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },

  text: {
    color: colors.success,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.2,
  },
});

export const ICON_SIZE = 12;
export const ICON_COLOR = colors.primary[600];
