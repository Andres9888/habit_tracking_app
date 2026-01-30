/**
 * HabitCard Core Styles
 * StyleSheet for main card layout and content
 */

import { StyleSheet } from 'react-native';
export { actionStyles } from './HabitCard.actionStyles';

export const styles = StyleSheet.create({
  accentBar: { bottom: 0, left: 0, position: 'absolute', top: 0 },
  bottomRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginTop: 2,
  },
  card: { flex: 1, flexDirection: 'row', overflow: 'hidden' },
  checkmark: {
    alignItems: 'center',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  checkmarkText: { color: '#FFFFFF', fontSize: 14, fontWeight: 'bold' },
  completedText: { opacity: 0.6 },
  container: { height: 88, marginVertical: 6, position: 'relative' },
  content: { flex: 1, justifyContent: 'space-between', padding: 16 },
  disabled: { opacity: 0.5 },
  habitInfo: { alignItems: 'center', flex: 1, flexDirection: 'row', gap: 8 },
  icon: { fontSize: 24 },
  strengthFill: { bottom: 0, left: 0, position: 'absolute', top: 0 },
  statusContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    marginLeft: 8,
  },
  topRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  warningBadge: {
    alignItems: 'center',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  warningText: { fontSize: 12 },
});
