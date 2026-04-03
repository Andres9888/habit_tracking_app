import { StyleSheet } from 'react-native';
import { colors } from '@/theme';
import { borderRadius } from '../../../theme/spacing';
import { typography, fontFamilies } from '@/theme/typography';

export const statsStyles = StyleSheet.create({
  ageText: {
    color: colors.gray[500],
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    marginTop: 10,
  },
  statsContainer: {
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  statsDot: {
    backgroundColor: colors.gray[300],
    borderRadius: 4,
    height: 6,
    marginRight: 8,
    width: 6,
  },
  statsHeader: {
    color: colors.gray[500],
    fontFamily: fontFamilies.monospace,
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
    fontFamily: fontFamilies.monospace,
    fontSize: typography.bodySmall.fontSize,
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
    color: colors.warning,
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    marginLeft: 6,
  },
});
