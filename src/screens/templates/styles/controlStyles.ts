import { StyleSheet } from 'react-native';
import { fontFamilies } from '@/theme/typography';

export const controlStyles = StyleSheet.create({
  controlButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  controlButtonActive: {},
  controlButtonText: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: '600',
  },
  controlRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
  },
  filterControlsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
});
