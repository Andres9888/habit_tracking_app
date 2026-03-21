/**
 * WeeklySummaryStrip - Card Container Styles
 */

import { StyleSheet } from 'react-native';

import { shadows } from '../../../theme/spacing';

export const cardStyles = StyleSheet.create({
  card: {
    ...shadows.card,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowOpacity: 0.08,
  },
  cardGradient: {
    borderColor: '#a7f3d0', // status.success border
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  container: {
    marginBottom: 12,
  },
  content: {
    padding: 16,
  },
});
