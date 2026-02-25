import { StyleSheet } from 'react-native';
import { borderRadius } from '../../../../theme/spacing';
import { fontFamilies } from '../../../../theme/typography';

/**
 * Pill vertical offset: aligns pill vertical center with the FAB center.
 * The ProgressRingFAB has marginTop: -20 and is 60px tall, so its center
 * sits at -20 + 30 = 10px from the container's content top.
 * The pill is 38px tall, so it needs to start at 10 - 19 = -9px.
 * The container has paddingTop: 12, so net pill offset = -9px from content top.
 */
const PILL_OFFSET_TOP = -9;

export const styles = StyleSheet.create({
  centerZone: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    overflow: 'visible',
  },
  container: {
    alignItems: 'flex-start',
    borderTopWidth: 1,
    flexDirection: 'row',
    overflow: 'visible',
    paddingHorizontal: 22,
    paddingTop: 12,
  },
  leftZone: { alignItems: 'flex-start', flex: 1, marginTop: PILL_OFFSET_TOP },
  pill: {
    alignItems: 'center',
    borderRadius: borderRadius.button,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 6,
    height: 38,
    justifyContent: 'center',
    minWidth: 112,
    paddingHorizontal: 14,
  },
  pillLabel: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: '600',
  },
  rightZone: { alignItems: 'flex-end', flex: 1, marginTop: PILL_OFFSET_TOP },
});
