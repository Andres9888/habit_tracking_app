import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { typography, fontFamilies } from '@/theme/typography';

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
    color: colors.warning,
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: '500',
  },
  celebrationTitle: {
    color: colors.warning,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    marginBottom: 2,
  },
  nextMilestoneText: {
    color: colors.warning,
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    marginTop: 8,
  },
});
