import { StyleSheet } from 'react-native';
import { borderRadius, shadows } from '../../../../theme/spacing';
import { fontFamilies } from '../../../../theme/typography';

export const styles = StyleSheet.create({
  addButton: {
    alignItems: 'center',
    borderRadius: borderRadius.large,
    borderWidth: 3,
    height: 52,
    justifyContent: 'center',
    marginTop: -20,
    width: 52,
    ...shadows.floatingActionButton,
  },
  centerZone: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    overflow: 'visible',
  },
  container: {
    alignItems: 'center',
    borderTopWidth: 1,
    flexDirection: 'row',
    overflow: 'visible',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  leftZone: { alignItems: 'flex-start', flex: 1 },
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
  pillLabel: { fontFamily: fontFamilies.primary.text, fontSize: 13, fontWeight: '600' },
  rightZone: { alignItems: 'flex-end', flex: 1 },
});
