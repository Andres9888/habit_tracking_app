/**
 * ConflictNotification Styles
 *
 * Amber-themed styling for the conflict resolution notification.
 * Uses amber tones to indicate informational status (conflict handled).
 * Distinct from green (success) and red (error) themes.
 */

import { StyleSheet } from 'react-native';

import { colors } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { typography, fontWeights, fontFamilies} from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    borderColor: colors.streak[300],
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  countText: {
    color: colors.warning,
    fontFamily: fontFamilies.monospace,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.medium,
  },

  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.streak[100],
    borderRadius: borderRadius.medium,
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

export const ICON_SIZE = 12;
export const ICON_COLOR = colors.streak[500];
