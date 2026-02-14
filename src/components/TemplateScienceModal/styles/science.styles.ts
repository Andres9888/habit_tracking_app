/**
 * Science section styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../theme/spacing';
import { typography } from '@/theme/typography';

export const scienceStyles = StyleSheet.create({
  citationDot: {
    backgroundColor: '#10B981',
    borderRadius: borderRadius.xs,
    height: 8,
    width: 8,
  },
  citationHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  citationLabel: {
    color: '#6B7280',
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  citationText: {
    color: '#3D3833',
    fontSize: 15,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  linkButton: {
    alignItems: 'center',
    backgroundColor: '#EFF6FF',
    borderColor: '#BFDBFE',
    borderRadius: borderRadius.medium,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 10,
    marginTop: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  linkText: {
    color: '#2563EB',
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '700',
  },
  whyItWorksContainer: {
    backgroundColor: '#F0FDF4',
    borderColor: '#BBF7D0',
    borderRadius: borderRadius.large,
    borderWidth: 1,
    padding: 18,
  },
  whyItWorksEmoji: {
    fontSize: 18,
  },
  whyItWorksHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 12,
  },
  whyItWorksText: {
    color: '#166534',
    fontSize: 15,
    lineHeight: 24,
  },
  whyItWorksTitle: {
    color: '#15803D',
    fontSize: 15,
    fontWeight: '700',
  },
});
