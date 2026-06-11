/** MonthNavigation styles — minimal round nav buttons + plain month label. */
import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

const NAV_BUTTON_SIZE = 32;

export const navStyles = StyleSheet.create({
  monthText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.semibold,
  },
  navButton: {
    alignItems: 'center',
    borderRadius: borderRadius.full,
    height: NAV_BUTTON_SIZE,
    justifyContent: 'center',
    width: NAV_BUTTON_SIZE,
  },
  navButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
