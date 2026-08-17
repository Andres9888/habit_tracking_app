/** MonthNavigation — Literata month label + 44px circular hairline buttons. */
import { StyleSheet } from 'react-native';
import { fontFamilies, fontWeights } from '@/theme/typography';

const NAV_BUTTON_SIZE = 44;

export const navStyles = StyleSheet.create({
  monthText: {
    fontFamily: fontFamilies.primary.display,
    fontSize: 20,
    fontWeight: fontWeights.medium,
    letterSpacing: -0.2,
  },
  navButton: {
    alignItems: 'center',
    borderRadius: NAV_BUTTON_SIZE / 2,
    borderWidth: 1,
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
    paddingBottom: 4,
    paddingTop: 2,
  },
  rowStandalone: {
    marginBottom: 0,
    paddingBottom: 14,
    paddingHorizontal: 2,
    paddingTop: 6,
  },
});
