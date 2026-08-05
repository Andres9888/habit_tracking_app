/**
 * Container and layout styles for ShareCardGenerator
 */

import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { borderRadius } from '@/theme/spacing';
import { typography, fontWeights, fontFamilies} from '../../../theme/typography';

export const containerStyles = StyleSheet.create({
  closeButton: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: fontWeights.semibold,
  },
  container: {
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
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.heading2.fontSize,
    fontWeight: fontWeights.semibold,
  },
});
