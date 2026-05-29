import { StyleSheet } from 'react-native';
import { spacing, borderRadius } from '../../theme/spacing';
import { fontFamilies, fontWeights, typography } from '../../theme/typography';

export const styles = StyleSheet.create({
  // Scale-driven padding, margins, and typography are applied inline from SCALE_CONFIG.
  container: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
  containerCompact: {
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    width: '100%',
  },
  description: {
    maxWidth: 320,
    textAlign: 'center',
  },
  headline: {
    textAlign: 'center',
  },
  iconText: {
    textAlign: 'center',
  },
  quickStartSection: {
    alignItems: 'center',
    marginBottom: spacing.lg,
    marginTop: spacing.sm,
    width: '100%',
  },
  templateChip: {
    alignItems: 'center',
    borderRadius: borderRadius.card,
    flexDirection: 'row',
    gap: spacing.sm,
    paddingHorizontal: spacing.base,
    paddingVertical: spacing.md,
  },
  templateChipPressed: {
    transform: [{ scale: 0.98 }],
  },
  templateEmoji: {
    fontSize: typography.body.fontSize,
  },
  templateName: {
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: fontWeights.medium,
  },
  templateRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
    justifyContent: 'center',
  },
});
