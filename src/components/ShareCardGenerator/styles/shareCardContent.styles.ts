import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { typography } from '../../../theme/typography';

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
    color: colors.text.inverse,
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
  streakCount: {
    color: colors.text.inverse,
    fontSize: 56,
    fontWeight: '800',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { height: 2, width: 0 },
    textShadowRadius: 4,
  },
  personalMessage: {
    color: colors.text.inverse,
    fontSize: typography.heading2.fontSize,
    fontStyle: 'italic',
    marginTop: 28,
    paddingHorizontal: 24,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { height: 1, width: 0 },
    textShadowRadius: 2,
  },
});
