/**
 * Layout styles for FullsizeTemplatePreview
 */

import { StyleSheet } from 'react-native';

import { colors } from '@/theme/colors';
import { borderRadius } from '../../../theme/spacing';

export const layoutStyles = StyleSheet.create({
  bottomSpacer: {
    height: 140,
  },
  closeButton: {
    alignItems: 'center',
    backgroundColor: colors.gray[200],
    borderRadius: borderRadius.xl,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  confettiContainer: {
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
    zIndex: 1000,
  },
  container: {
    backgroundColor: colors.light.surfaceMuted,
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  header: {
    alignItems: 'flex-end',
    paddingBottom: 8,
    paddingHorizontal: 16,
    zIndex: 10,
  },
  successGlowOverlay: {
    borderRadius: borderRadius.medium,
    bottom: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
});
