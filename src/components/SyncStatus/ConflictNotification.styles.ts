/**
 * ConflictNotification - Styles
 */

import { StyleSheet } from 'react-native';
import { borderRadius } from '@/theme/spacing';
import { typography, fontFamilies, fontWeights } from '@/theme/typography';

export const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.medium,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  icon: { fontSize: 22 },
  iconContainer: { marginRight: 12 },
  message: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    fontWeight: fontWeights.regular,
    lineHeight: 18,
  },
  textContainer: { flex: 1 },
  title: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.semibold,
    marginBottom: 3,
  },
});
