/**
 * Styles for ShareCard content sections (emoji, info, progress)
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../theme/spacing';

export const shareCardContentStyles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
  },
  cardContent: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 48,
  },
  emoji: {
    fontSize: 120,
  },
  emojiContainer: {
    alignItems: 'center',
    marginTop: 48,
  },
  habitName: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { height: 2, width: 0 },
    textShadowRadius: 4,
  },
  infoContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  milestoneLabel: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 2,
  },
  milestoneRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 16,
    marginBottom: 16,
  },
  personalMessage: {
    color: '#FFFFFF',
    fontSize: 20,
    fontStyle: 'italic',
    marginTop: 32,
    paddingHorizontal: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 2,
  },
  progressBarBackground: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: borderRadius.small,
    height: 12,
    overflow: 'hidden',
  },
  progressBarContainer: {
    marginTop: 24,
    width: '100%',
  },
  progressBarFill: {
    backgroundColor: '#FFFFFF',
    borderRadius: borderRadius.small,
    height: '100%',
  },
  strengthPercentage: {
    color: '#FFFFFF',
    fontSize: 48,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { height: 2, width: 0 },
    textShadowRadius: 4,
  },
});
