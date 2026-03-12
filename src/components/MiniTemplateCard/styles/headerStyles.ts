/**
 * Header and icon styles for MiniTemplateCard
 */

import type { ViewStyle, TextStyle } from 'react-native';

import { borderRadius } from '../../../theme/spacing'
;

export const headerStyles: Record<string, ViewStyle | TextStyle> = {
  chevronContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.04)',
    borderRadius: 8,
    height: 28,
    justifyContent: 'center',
    width: 28,
  },
  icon: {
    fontSize: 22,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: 12,
    height: 42,
    justifyContent: 'center',
    width: 42,
  },
  iconWrapper: {
    position: 'relative',
  },
  scienceBadge: {
    alignItems: 'center',
    backgroundColor: '#10b981',
    borderRadius: borderRadius.full,
    bottom: -4,
    height: 18,
    justifyContent: 'center',
    position: 'absolute',
    right: -4,
    width: 18,
  },
  topRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
};
