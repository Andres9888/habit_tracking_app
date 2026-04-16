/**
 * Video embed and tips styles for the Science & Evidence section
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, spacing } from '../../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';

const PLAY_ICON_SIZE = 56;

export const evidenceDetailStyles = StyleSheet.create({
  playCircle: {
    alignItems: 'center',
    backgroundColor: colors.error,
    borderRadius: PLAY_ICON_SIZE / 2,
    elevation: 4,
    height: PLAY_ICON_SIZE,
    justifyContent: 'center',
    shadowColor: colors.error,
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    width: PLAY_ICON_SIZE,
  },
  tipIconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  tipItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    marginBottom: 10,
  },
  tipNumber: {
    fontFamily: fontFamilies.monospace,
    fontSize: 13,
    fontWeight: fontWeights.bold,
  },
  tipText: {
    color: colors.primary[700],
    flex: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: 14,
    lineHeight: 22,
  },
  tipsDivider: {
    backgroundColor: `${colors.primary[500]}20`,
    height: 1,
    marginVertical: spacing.md,
  },
  videoCard: {
    borderColor: `${colors.primary[500]}18`,
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    marginTop: spacing.md,
    overflow: 'hidden',
  },
  videoLabel: {
    ...typography.bodySmall,
    color: colors.gray[800],
    fontWeight: fontWeights.semibold,
  },
  videoMeta: {
    padding: 12,
  },
  videoSubtitle: {
    ...typography.caption,
    color: colors.gray[400],
    marginTop: 2,
  },
  videoThumbnail: {
    alignItems: 'center',
    height: 120,
    justifyContent: 'center',
  },
});
