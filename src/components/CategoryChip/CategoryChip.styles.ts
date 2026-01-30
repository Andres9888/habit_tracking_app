/**
 * CategoryChip Styles
 */

import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  background: {
    borderRadius: 20,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    elevation: 2,
    marginRight: 10,
    minHeight: 40,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { height: 1, width: 0 },
    shadowOpacity: 0.06,
    shadowRadius: 3,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  countBadge: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  countText: {
    fontSize: 12,
    fontWeight: '700',
  },
  gradient: {
    borderRadius: 20,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  gradientWrapper: {
    borderRadius: 20,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  icon: {
    fontSize: 16,
  },
  iconWrapper: {
    alignItems: 'center',
    borderRadius: 10,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
});
