import { StyleSheet } from 'react-native';
import { fontWeights, typography } from '@/theme/typography';

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
    ...typography.caption,
    fontWeight: fontWeights.semibold,
  },
  controlRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
