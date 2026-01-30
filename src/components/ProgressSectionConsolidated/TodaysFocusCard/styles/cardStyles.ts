/**
 * Card Styles
 *
 * Container and layout styles for TodaysFocusCard.
 */

import { StyleSheet } from 'react-native';

export const cardStyles = StyleSheet.create({
  container: {
    borderRadius: 16,
    elevation: 3,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  textContainer: {
    flex: 1,
  },
});
