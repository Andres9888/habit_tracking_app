import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  backdrop: {
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
  },
  card: {
    alignItems: 'center',
    borderRadius: 20,
    elevation: 8,
    paddingHorizontal: 28,
    paddingVertical: 32,
    shadowColor: '#000',
    shadowOffset: { height: 4, width: 0 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    width: '100%',
  },
  contextMessage: {
    fontSize: 13,
    marginBottom: 4,
    marginTop: 6,
    opacity: 0.65,
    textAlign: 'center',
  },
  emoji: {
    fontSize: 44,
    marginBottom: 12,
  },
  negativeButton: {
    borderRadius: 12,
    borderWidth: 1.5,
    flex: 1,
    paddingVertical: 14,
  },
  negativeLabel: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
  },
  positiveButton: {
    borderRadius: 12,
    flex: 1,
    paddingVertical: 14,
  },
  positiveLabel: {
    fontSize: 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
    opacity: 0.75,
    textAlign: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
});
