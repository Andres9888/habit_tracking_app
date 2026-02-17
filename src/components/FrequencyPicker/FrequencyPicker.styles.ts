import { StyleSheet } from 'react-native';

export const frequencyPickerStyles = StyleSheet.create({
  container: {
    gap: 12,
    paddingVertical: 8,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.8,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  optionCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 12,
    borderWidth: 1.5,
    gap: 4,
  },
  optionIcon: {
    fontSize: 20,
  },
  optionLabel: {
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  dayRow: {
    flexDirection: 'row',
    gap: 6,
    justifyContent: 'center',
  },
  dayChip: {
    width: 42,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  dayChipText: {
    fontSize: 13,
    fontWeight: '600',
  },
  numberRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  numberChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.5,
  },
  numberChipActive: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  numberChipText: {
    fontSize: 14,
    fontWeight: '600',
  },
});
