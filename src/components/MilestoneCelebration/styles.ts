/**
 * Styles for MilestoneCelebration component
 */

import { StyleSheet } from 'react-native';
import { milestoneColors } from '../../theme/milestone-colors';

export const styles = StyleSheet.create({
  actions: {
    gap: 12,
    width: '100%',
  },
  badgeContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  container: {
    flex: 1,
    justifyContent: 'space-between',
    paddingBottom: 40,
    paddingTop: 80,
  },
  content: {
    alignItems: 'center',
    gap: 16,
  },
  description: {
    marginTop: 4,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 80,
    textAlign: 'center',
  },
  glow: {
    borderRadius: 9999,
    elevation: 20,
    height: 160,
    position: 'absolute',
    shadowColor: milestoneColors.amber,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    width: 160,
  },
  habitName: {
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  levelName: {
    marginTop: 8,
    textAlign: 'center',
  },
  modalContent: {
    paddingHorizontal: 24,
  },
  percentage: {
    fontSize: 34,
    lineHeight: 56,
  },
  percentageContainer: {
    alignItems: 'center',
    gap: 4,
    marginTop: 24,
  },
});
