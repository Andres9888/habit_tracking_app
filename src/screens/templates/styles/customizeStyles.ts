import { StyleSheet } from 'react-native';
import { borderRadius } from '@/theme/spacing';
import { fontWeights, typography } from '@/theme/typography';

export const customizeStyles = StyleSheet.create({
  customizeSection: {
    marginTop: 4,
  },
  customizeSubtitle: {
    ...typography.caption,
    borderRadius: borderRadius.small,
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  customizeTitle: {
    ...typography.body,
    fontWeight: fontWeights.bold,
    letterSpacing: -0.2,
  },
  customizeTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
});
