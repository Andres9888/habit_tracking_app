/**
 * Card layout styles for MiniTemplateCard
 */

import type { ViewStyle, TextStyle } from 'react-native';
import { shadows, borderRadius } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export const cardStyles: Record<string, ViewStyle | TextStyle> = {
  accent: {
    borderBottomLeftRadius: borderRadius.large,
    borderTopLeftRadius: borderRadius.large,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
  },
  card: {
    ...shadows.card,
    borderRadius: borderRadius.large,
    flexDirection: 'column',
    marginRight: 12,
    minHeight: 150,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingLeft: 18,
    paddingVertical: 14,
    shadowOpacity: 0.08,
    width: 200,
  },
  description: {
    color: '#78716c',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 36,
  },
  glowOverlay: {
    borderRadius: borderRadius.large,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  name: {
    color: '#1c1917',
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 2,
  },
  subtitle: {
    color: '#6B7280',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 16,
    marginBottom: 4,
  },
};
