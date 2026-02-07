import { StyleSheet } from 'react-native';

import { shadows } from '../../theme/spacing';

export const DISMISS_THRESHOLD = 50;

export const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    left: 20,
    position: 'absolute',
    right: 20,
    zIndex: 9999,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
    paddingHorizontal: 16,
    paddingTop: 14,
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: '#fee2e2', // red-100
    borderRadius: 10,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  itemName: {
    color: '#1c1917', // stone-900
    fontWeight: '600',
  },
  message: {
    flex: 1,
    fontSize: 14,
  },
  messageText: {
    color: '#78716c', // stone-500
  },
  progressBar: {
    backgroundColor: '#dc2626', // red-600
    height: '100%',
  },
  progressContainer: {
    backgroundColor: '#fee2e2', // red-100
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
    height: 3,
    overflow: 'hidden',
    width: '100%',
  },
  toast: {
    backgroundColor: '#ffffff',
    borderColor: '#fecaca', // red-200
    borderRadius: 24,
    borderWidth: 1,
    ...shadows.modal,
    maxWidth: 400,
    overflow: 'hidden',
    shadowColor: '#dc2626', // red-600
    width: '100%',
  },
  undoButton: {
    alignItems: 'center',
    backgroundColor: '#fee2e2', // red-100
    borderRadius: 10,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  undoButtonPressed: {
    backgroundColor: '#fecaca', // red-200
  },
  undoText: {
    color: '#dc2626', // red-600
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
