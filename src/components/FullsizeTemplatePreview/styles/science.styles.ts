/**
 * Science box styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';
import { typography } from '@/theme/typography';

export const scienceStyles = StyleSheet.create({
  researchLinkButton: {
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  researchLinkText: {
    color: '#2563EB',
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
  scienceBox: {
    backgroundColor: '#f0fdf4',
    borderColor: '#bbf7d0',
    borderRadius: borderRadius.large,
    borderWidth: 2,
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
  },
  scienceDivider: {
    backgroundColor: '#bbf7d0',
    height: 1,
    marginBottom: 12,
  },
  scienceHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  scienceIcon: {
    fontSize: typography.heading2.fontSize,
  },
  scienceLabel: {
    color: '#166534',
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  scienceQuote: {
    color: '#166534',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 24,
  },
});
