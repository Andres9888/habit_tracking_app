import { StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';

export const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: 'center',
  },
  emoji: {
    fontSize: 48,
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.gray[900],
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: colors.gray[500],
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 21,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  negativeButton: {
    backgroundColor: colors.gray[100],
  },
  positiveButton: {
    backgroundColor: '#059669',
  },
  negativeText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.gray[600],
  },
  positiveText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#ffffff',
  },
});
