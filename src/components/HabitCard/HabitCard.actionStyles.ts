/**
 * HabitCard Action Styles
 * StyleSheet for swipe action buttons
 */

import { StyleSheet } from 'react-native';

import { ACTION_WIDTH } from './HabitCard.constants';
import { colors } from '../../theme/colors';

export const actionStyles = StyleSheet.create({
  actionButton: {
    alignItems: 'center',
    height: '100%',
    justifyContent: 'center',
    width: ACTION_WIDTH,
  },
  actionsContainer: {
    alignItems: 'center',
    bottom: 0,
    flexDirection: 'row',
    position: 'absolute',
    right: 0,
    top: 0,
  },
  actionText: {
    color: colors.text.inverse,
    fontSize: 15,
    fontWeight: '600',
  },
});
