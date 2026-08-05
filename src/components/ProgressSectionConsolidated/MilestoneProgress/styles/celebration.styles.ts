import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { typography, fontWeights } from '@/theme/typography';

export const celebrationStyles = StyleSheet.create({
  celebrationContainer: {
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    borderColor: colors.streak[300],
    borderWidth: 1,
  },
  celebrationContent: {
    alignItems: 'center',
    padding: 8,
  },
  celebrationEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  celebrationSubtext: {
    ...typography.caption,
    color: colors.warning,
  },
  celebrationTitle: {
    ...typography.body,
    color: colors.warning,
    fontWeight: fontWeights.bold,
    marginBottom: 2,
  },
  nextMilestoneText: {
    ...typography.caption,
    color: colors.warning,
    marginTop: 8,
  },
});
