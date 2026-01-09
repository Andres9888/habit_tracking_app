/**
 * Card layout styles for MiniTemplateCard
 */

import type { ViewStyle, TextStyle } from 'react-native';

export const cardStyles: Record<string, ViewStyle | TextStyle> = {
  accent: {
    borderBottomLeftRadius: 16,
    borderTopLeftRadius: 16,
    bottom: 0,
    left: 0,
    position: 'absolute',
    top: 0,
    width: 4,
  },
  card: {
    borderRadius: 16,
    elevation: 3,
    flexDirection: 'column',
    marginRight: 12,
    minHeight: 150,
    overflow: 'hidden',
    paddingHorizontal: 14,
    paddingLeft: 18,
    paddingVertical: 14,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    width: 200,
  },
  description: {
    color: '#78716c',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 36,
  },
  glowOverlay: {
    borderRadius: 16,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  name: {
    color: '#1c1917',
    fontSize: 16,
    fontWeight: '700',
    lineHeight: 21,
    marginBottom: 6,
  },
};
