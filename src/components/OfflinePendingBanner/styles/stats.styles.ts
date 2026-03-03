import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../theme/spacing';
import { colors } from '../../../theme/colors';
import { typography } from '@/theme/typography';

export const statsStyles = StyleSheet.create({
  ageText: {
    color: colors.text.secondary,
    fontSize: typography.caption.fontSize,
    marginTop: 10,
  },
  statsContainer: {
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  statsDot: {
    backgroundColor: colors.gray[400],
    borderRadius: 3,
    height: 6,
    marginRight: 8,
    width: 6,
  },
  statsHeader: {
    color: colors.gray[600],
    fontSize: typography.caption.fontSize,
    fontWeight: '600',
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
    color: colors.gray[700],
    fontSize: typography.bodySmall.fontSize,
  },
  warningContainer: {
    alignItems: 'center',
    backgroundColor: colors.warning[100],
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  warningText: {
    color: colors.warning[700],
    fontSize: 13,
    marginLeft: 6,
  },
});
