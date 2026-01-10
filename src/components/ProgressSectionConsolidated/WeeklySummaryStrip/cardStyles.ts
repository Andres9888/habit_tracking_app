/**
 * WeeklySummaryStrip - Card Container Styles
 */

import { StyleSheet } from 'react-native';

export const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    elevation: 2,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { height: 2, width: 0 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  cardGradient: {
    borderColor: '#a7f3d0', // emerald-200
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
