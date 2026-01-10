/**
 * Toast Styles
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  container: {
    alignItems: 'center',
    left: 16,
    position: 'absolute',
    right: 16,
    zIndex: 9999,
  },
  dismissButton: {
    alignItems: 'center',
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  dismissIcon: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  icon: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  message: {
    flex: 1,
  },
  toast: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    maxWidth: 400,
    paddingHorizontal: 16,
    paddingVertical: 12,
    width: '100%',
  },
});
