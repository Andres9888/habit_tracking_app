/**
 * YouTube section styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';
import { typography } from '@/theme/typography';

/** YouTube-themed colors (red palette, not part of core design tokens) */
const YOUTUBE_BG = '#FEF2F2'; // red-50
const YOUTUBE_BORDER = '#FECACA'; // red-200
const YOUTUBE_TEXT = '#DC2626'; // red-600

export const youtubeStyles = StyleSheet.create({
  youtubeButton: {
    alignItems: 'center',
    backgroundColor: YOUTUBE_BG,
    borderColor: YOUTUBE_BORDER,
    borderRadius: borderRadius.large,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 14,
    padding: 16,
  },
  youtubeGradient: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  youtubeSubtitle: {
    color: YOUTUBE_TEXT,
    fontSize: 13,
    fontWeight: '500',
  },
  youtubeTextContainer: {
    flex: 1,
  },
  youtubeTitle: {
    color: colors.gray[900],
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    marginBottom: 2,
  },
});
