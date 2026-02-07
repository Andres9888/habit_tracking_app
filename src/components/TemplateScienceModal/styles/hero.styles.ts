/**
 * Hero section styles for TemplateScienceModal
 */

import { StyleSheet } from 'react-native';

import { borderRadius } from '../../../theme/spacing';

export const heroStyles = StyleSheet.create({
  categoryBadge: {
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryText: {
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  frequencyPill: {
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: borderRadius.xl,
    flexDirection: 'row',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  frequencyPillText: {
    color: '#6B7280',
    fontSize: 13,
    fontWeight: '600',
  },
  heroGradient: {
    paddingBottom: 28,
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  iconContainer: {
    alignItems: 'center',
    borderRadius: borderRadius.xl,
    height: 96,
    justifyContent: 'center',
    width: 96,
  },
  iconGlow: {
    borderRadius: borderRadius.full,
    height: 96,
    opacity: 0.25,
    position: 'absolute',
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    width: 96,
  },
  iconText: {
    fontSize: 48,
  },
  iconWrapper: {
    marginBottom: 20,
    position: 'relative',
  },
  pillRow: {
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'center',
    marginTop: 16,
  },
});
