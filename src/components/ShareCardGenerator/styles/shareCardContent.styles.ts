/**
 * Styles for ShareCard content sections (emoji, info, progress)
 */

// Intentional: static color for share card rendering — white text/fills on gradient backgrounds
import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { typography, fontFamilies, fontWeights } from '../../../theme/typography';

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
    color: colors.text.inverse,
    fontFamily: fontFamilies.primary.display,
    fontSize: 36,
    fontWeight: fontWeights.bold,
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
    color: colors.text.inverse,
    fontFamily: fontFamilies.primary.text,
    fontSize: 28,
    fontWeight: fontWeights.semibold,
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
    color: colors.text.inverse,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.heading2.fontSize,
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
    backgroundColor: colors.text.inverse,
    borderRadius: borderRadius.small,
    height: '100%',
  },
  strengthPercentage: {
    color: colors.text.inverse,
    fontFamily: fontFamilies.primary.display,
    fontSize: typography.displayLarge.fontSize,
    fontWeight: fontWeights.bold,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { height: 2, width: 0 },
    textShadowRadius: 4,
  },
});
