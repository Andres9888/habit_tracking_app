/**
 * Import button styles for MiniTemplateCard
 */

import type { ViewStyle, TextStyle } from 'react-native';
import { typography, fontWeights, fontFamilies} from '@/theme/typography';

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
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.bold,
  },
  importButtonWrapper: {
    bottom: 14,
    position: 'absolute',
    right: 14,
  },
};
