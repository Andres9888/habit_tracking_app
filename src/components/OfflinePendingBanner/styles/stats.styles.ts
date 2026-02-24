import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../theme/spacing';
import { typography, fontFamilies} from '@/theme/typography';

export const statsStyles = StyleSheet.create({
  ageText: {
    color: '#71717A',
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    marginTop: 10,
  },
  statsContainer: {
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  statsDot: {
    backgroundColor: '#A1A1AA',
    borderRadius: 4,
    height: 6,
    marginRight: 8,
    width: 6,
  },
  statsHeader: {
    color: '#52525B',
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
    color: '#3F3F46',
    fontFamily: fontFamilies.monospace,
    fontSize: typography.bodySmall.fontSize,
  },
  warningContainer: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: borderRadius.small,
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  warningText: {
    color: '#92400E',
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    marginLeft: 6,
  },
});
