import { StyleSheet } from 'react-native';

export const statsStyles = StyleSheet.create({
  ageText: {
    color: '#71717A',
    fontSize: 12,
    marginTop: 10,
  },
  statsContainer: {
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  statsDot: {
    backgroundColor: '#A1A1AA',
    borderRadius: 3,
    height: 6,
    marginRight: 8,
    width: 6,
  },
  statsHeader: {
    color: '#52525B',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  statsItem: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  statsList: {
    gap: 6,
  },
  statsText: {
    color: '#3F3F46',
    fontSize: 14,
  },
  warningContainer: {
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    flexDirection: 'row',
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  warningText: {
    color: '#92400E',
    fontSize: 13,
    marginLeft: 6,
  },
});
