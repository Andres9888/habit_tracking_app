import { StyleSheet } from 'react-native';
import { fontFamilies } from '@/theme/typography';

export const controlStyles = StyleSheet.create({
  controlButton: {
    alignItems: 'center',
    borderColor: '#e7e5e4',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  controlButtonActive: {
    backgroundColor: '#111827',
    borderColor: '#111827',
  },
  controlButtonText: {
    color: '#1c1917',
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
    paddingHorizontal: 20,
  },
});
