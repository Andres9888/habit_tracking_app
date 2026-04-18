/**
 * HabitCard Action Styles
 * StyleSheet for swipe action buttons
 */

import { StyleSheet, TextStyle } from 'react-native';
import { colors } from '@/theme/colors';
import { typography, fontWeights } from '@/theme/typography';
import { ACTION_WIDTH } from './HabitCard.constants';

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
    ...typography.bodySmall,
    color: colors.text.inverse,
    fontWeight: fontWeights.semibold,
  } as TextStyle,
});
