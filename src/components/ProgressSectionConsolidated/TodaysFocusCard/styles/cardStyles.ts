/**
 * Card Styles
 *
 * Container and layout styles for TodaysFocusCard.
 */

import { StyleSheet } from 'react-native';
import { absoluteFillObject } from '../../../../theme/absoluteFillObject';

import { borderRadius, shadows } from '../../../../theme/spacing';

export const cardStyles = StyleSheet.create({
  container: {
    ...shadows.card,
    borderRadius: borderRadius.card,
    marginBottom: 12,
    overflow: 'hidden',
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    zIndex: 2,
  },
  gradient: {
    overflow: 'hidden',
    position: 'relative',
  },
  shimmerGradient: {
    height: '100%',
    width: 200,
  },
  shimmerOverlay: {
    ...absoluteFillObject,
    zIndex: 1,
  },
  textContainer: {
    flex: 1,
  },
});
