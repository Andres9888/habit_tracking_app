/**
 * OfflineIndicator Styles
 *
 * Subtle, non-intrusive styling for the offline status indicator.
 * Uses muted colors to avoid distraction while remaining visible.
 */

import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { typography, fontWeights, fontFamilies} from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: colors.gray[50],
    borderColor: colors.gray[200],
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },

  iconContainer: {
    alignItems: 'center',
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.small,
    height: 20,
    justifyContent: 'center',
    width: 20,
  },

  text: {
    color: colors.gray[500],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.medium,
    letterSpacing: 0.2,
  },
});
