/**
 * Import button styles for MiniTemplateCard
 */

import type { ViewStyle, TextStyle } from 'react-native';
import { typography } from '@/theme/typography';

export const importButtonStyles: Record<string, ViewStyle | TextStyle> = {
  checkmarkContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 4,
  },
  importButton: {
    alignItems: 'center',
    borderRadius: 8,
    flexDirection: 'row',
    gap: 4,
    justifyContent: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  importButtonText: {
    color: '#fff',
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
  },
  importButtonWrapper: {
    bottom: 14,
    position: 'absolute',
    right: 14,
  },
};
