import { StyleSheet } from 'react-native';

import {
  typography,
  fontFamilies,
  fontWeights,
} from '../../../theme/typography';
import { CHIP_BASE } from './WeekNavRow.constants';

export const s = StyleSheet.create({
  chipText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.tabBar.fontSize,
    fontWeight: fontWeights.bold,
    letterSpacing: 0.3,
  },
  dateText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.medium,
  },
  monthText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.bold,
  },
  pill: { ...CHIP_BASE, borderWidth: 1, gap: 5 },
  row: { alignItems: 'center', flexDirection: 'row', marginTop: 2 },
  sideColumnRight: { alignItems: 'flex-end', flex: 1 },
  solidChip: { ...CHIP_BASE, gap: 4 },
});
