/**
 * CategoryChip Styles
 */

import { StyleSheet } from 'react-native';

import { borderRadius, shadows } from '../../theme/spacing';
import { typography, fontFamilies} from '@/theme/typography';

export const styles = StyleSheet.create({
  background: {
    borderRadius: borderRadius.xl,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  container: {
    ...shadows.subtle,
    marginRight: 10,
    minHeight: 40,
    overflow: 'hidden',
    position: 'relative',
    shadowOpacity: 0.06,
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
    fontFamily: fontFamilies.monospace,
    fontSize: typography.caption.fontSize,
    fontWeight: '700',
  },
  gradient: {
    borderRadius: borderRadius.xl,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  gradientWrapper: {
    borderRadius: borderRadius.xl,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  icon: {
    fontSize: typography.body.fontSize,
  },
  iconWrapper: {
    alignItems: 'center',
    borderRadius: borderRadius.medium,
    height: 24,
    justifyContent: 'center',
    width: 24,
  },
  label: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
});
