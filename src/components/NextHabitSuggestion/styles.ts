import { StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';
import { shadows, borderRadius, componentSpacing } from '@/theme/spacing';
import { fontFamilies } from '@/theme/typography';

export const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    backgroundColor: colors.warningLight,
    borderRadius: borderRadius.medium,
    flexDirection: 'row',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    color: colors.warning,
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: '600',
  },
  container: {
    ...shadows.card,
    backgroundColor: colors.text.inverse,
    borderRadius: borderRadius.large,
    marginHorizontal: componentSpacing.card.marginHorizontal,
    marginVertical: componentSpacing.card.marginVertical,
    overflow: 'hidden',
  },
  content: {
    padding: componentSpacing.card.padding,
  },
  completedContainer: {
    marginHorizontal: componentSpacing.card.marginHorizontal,
    borderRadius: borderRadius.large,
    marginVertical: componentSpacing.card.marginVertical,
    alignItems: 'center',
    padding: 20,
    backgroundColor: colors.primary[100],
  },
  glow: {
    backgroundColor: colors.streak[300],
    height: 4,
    left: 0,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  completedEmoji: {
    fontSize: 36,
    marginBottom: 8,
  },
  habitHint: {
    color: colors.text.secondary,
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
  },
  completedSubtitle: {
    color: colors.primary[600],
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
  },
  habitIcon: {
    fontSize: 32,
  },
  completedTitle: {
    color: colors.primary[700],
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
  },
  habitRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  habitInfo: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  habitName: {
    color: colors.gray[900],
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 2,
  },
  progress: {
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    color: colors.text.secondary,
    fontWeight: '500',
  },
});
