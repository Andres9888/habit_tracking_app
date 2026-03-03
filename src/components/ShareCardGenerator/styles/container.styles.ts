/**
 * Container and layout styles for ShareCardGenerator
 */

import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '../../../theme/spacing';
import { typography } from '../../../theme/typography';

export const containerStyles = StyleSheet.create({
  closeButton: {
    fontSize: 17,
    fontWeight: '600',
  },
  container: {
    // TODO: colors.light.card is not theme-aware — revisit for dark-mode support
    backgroundColor: colors.light.card,
    flex: 1,
  },
  customizationSection: {
    borderTopColor: colors.border,
    borderTopWidth: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  previewContainer: {
    backgroundColor: colors.gray[100],
    borderRadius: borderRadius.medium,
    overflow: 'hidden',
  },
  previewSection: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 24,
  },
  title: {
    fontSize: typography.heading2.fontSize,
    fontWeight: '600',
  },
});
