/**
 * SyncingIndicator Styles
 *
 * Subtle, non-intrusive styling for the syncing status indicator.
 * Uses amber/orange tones to indicate active sync process.
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../theme/spacing';
import { typography, fontWeights, fontFamilies} from '@/theme/typography';
import { colors } from '../../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    borderColor: colors.streak[100],
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },

  countBadge: {
    backgroundColor: colors.streak[500],
    borderRadius: borderRadius.small,
    marginLeft: 2,
    minWidth: 16,
    paddingHorizontal: 4,
    paddingVertical: 1,
  },

  countText: {
    color: colors.text.inverse,
    fontFamily: fontFamilies.monospace,
    fontSize: typography.tabBar.fontSize,
    fontWeight: fontWeights.semibold,
    textAlign: 'center',
  },

  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.streak[100],
    borderRadius: borderRadius.small,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },

  text: {
    color: colors.warning,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.2,
  },
});
