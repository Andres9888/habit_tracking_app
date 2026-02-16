import { StyleSheet } from 'react-native';
import type { SemanticColors } from '../../../theme/darkColors';

export const controlStyles = StyleSheet.create({
  controlButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  controlButtonActive: {
    backgroundColor: '#111827',
  },
  controlButtonText: {
    color: '#1c1917',
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

export function themedControlStyles(colors: SemanticColors) {
  return StyleSheet.create({
    controlButton: {
      borderColor: colors.borders.subtle,
    },
    controlButtonActive: {
      borderColor: colors.borders.strong,
    },
  });
}
