import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { borderRadius } from '../../../theme/spacing';
import { typography, fontWeights, fontFamilies } from '@/theme/typography';

export const statsStyles = StyleSheet.create({
  ageText: {
    ...typography.caption,
    color: colors.gray[500],
    marginTop: 10,
  },
  statsContainer: {
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  statsDot: {
    backgroundColor: colors.gray[300],
    borderRadius: borderRadius.xs,
    height: 6,
    marginRight: 8,
    width: 6,
  },
  statsHeader: {
    ...typography.caption,
    fontFamily: fontFamilies.monospace,
    color: colors.gray[500],
    fontWeight: fontWeights.semibold,
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statsItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statsList: {
    gap: 6,
  },
  statsText: {
    ...typography.bodySmall,
    fontFamily: fontFamilies.monospace,
    color: colors.gray[700],
  },
  warningContainer: {
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  warningText: {
    ...typography.caption,
    color: colors.warning,
    marginLeft: 6,
  },
});
