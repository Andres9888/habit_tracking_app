/**
 * Toast Styles
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '../../theme/spacing';
import { typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  actionButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.small,
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
    fontSize: typography.body.fontSize,
    fontWeight: 'bold',
  },
  icon: {
    color: '#FFFFFF',
    fontSize: typography.bodySmall.fontSize,
    fontWeight: 'bold',
  },
  iconContainer: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: borderRadius.medium,
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
