/**
 * HabitCard Action Styles
 * Premium swipe action buttons with icons, rounded corners, and vertical layout.
 */

import { StyleSheet } from 'react-native';
import { ACTION_WIDTH } from './HabitCard.constants';

export const actionStyles = StyleSheet.create({
  actionButton: {
    borderRadius: 12,
    flex: 1,
    overflow: 'hidden',
    width: ACTION_WIDTH - 8,
  },
  actionLabel: {
    color: '#ffffff',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
    marginTop: 4,
    textTransform: 'uppercase',
  },
  actionPressable: {
    alignItems: 'center',
    flex: 1,
    gap: 2,
    justifyContent: 'center',
  },
  actionsContainer: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  actionsRow: {
    alignItems: 'stretch',
    flexDirection: 'row',
    gap: 6,
    height: '100%',
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
});
