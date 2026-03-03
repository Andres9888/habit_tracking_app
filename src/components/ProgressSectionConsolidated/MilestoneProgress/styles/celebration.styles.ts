import { StyleSheet } from 'react-native';
import { milestoneColors } from '@/theme/colors';
import { spacing } from '../../../../theme/spacing';
import { typography } from '@/theme/typography';

/** Amber-50 celebration background — lighter than warning[100] */
const CELEBRATION_BG = '#fefce8';
/** Amber-400 border — no exact token in colors.warning scale */
const AMBER_BORDER = '#fbbf24';

export const celebrationStyles = StyleSheet.create({
  celebrationContainer: {
    alignItems: 'center',
    backgroundColor: CELEBRATION_BG,
    borderColor: AMBER_BORDER,
    borderWidth: 1,
  },
  celebrationContent: {
    alignItems: 'center',
    padding: spacing.sm,
  },
  celebrationEmoji: {
    fontSize: 32,
    marginBottom: spacing.xs,
  },
  celebrationSubtext: {
    color: milestoneColors.amber800,
    fontSize: 13,
    fontWeight: '500',
  },
  celebrationTitle: {
    color: milestoneColors.amberDark,
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    marginBottom: 2,
  },
  nextMilestoneText: {
    color: milestoneColors.amber800,
    fontSize: typography.caption.fontSize,
    marginTop: spacing.sm,
  },
});
