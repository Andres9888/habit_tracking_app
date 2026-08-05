/**
 * Science section detail styles — video card, tip checkmark halos.
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme';
import { borderRadius, shadows, spacing } from '../../../theme/spacing';
import { fontFamilies, typography } from '@/theme/typography';

const PLAY_ICON_SIZE = 56;
const TIP_HALO_SIZE = 26;

export const evidenceDetailStyles = StyleSheet.create({
  playCircle: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.96)',
    borderRadius: PLAY_ICON_SIZE / 2,
    elevation: 4,
    height: PLAY_ICON_SIZE,
    justifyContent: 'center',
    paddingLeft: 3,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 12,
    width: PLAY_ICON_SIZE,
  },
  tipCheckHalo: {
    alignItems: 'center',
    backgroundColor: colors.primary[100],
    borderColor: colors.primary[500],
    borderRadius: TIP_HALO_SIZE / 2,
    borderWidth: 1.5,
    height: TIP_HALO_SIZE,
    justifyContent: 'center',
    marginTop: 2,
    width: TIP_HALO_SIZE,
  },
  tipItem: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 14,
    marginBottom: spacing.lg,
  },
  tipText: {
    color: colors.gray[800],
    flex: 1,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    lineHeight: 28,
  },
  videoCard: {
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
    ...shadows.card,
  },
  videoThumbnail: {
    alignItems: 'center',
    backgroundColor: colors.gray[200],
    height: 168,
    justifyContent: 'center',
    position: 'relative',
  },
  videoThumbnailImage: {
    height: '100%',
    left: 0,
    position: 'absolute',
    top: 0,
    width: '100%',
  },
  videoThumbnailOverlay: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
