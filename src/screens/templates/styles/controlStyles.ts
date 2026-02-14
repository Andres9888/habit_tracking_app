import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const controlStyles = StyleSheet.create({
  controlButton: {
    alignItems: 'center',
    borderColor: colors.border,
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  controlButtonActive: {
    backgroundColor: colors.gray[800],
    borderColor: colors.gray[800],
  },
  controlButtonText: {
    color: colors.gray[900],
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
