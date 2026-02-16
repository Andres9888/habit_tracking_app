import { StyleSheet } from 'react-native';
import { typography } from '@/theme/typography';
import type { SemanticColors } from '../../theme/darkColors';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    borderWidth: 1,
    marginHorizontal: 16,
    marginVertical: 16,
    padding: 16,
  },
  habitCard: {
    borderRadius: 8,
    marginBottom: 8,
    padding: 12,
  },
  habitInfo: {
    marginBottom: 6,
  },
  habitName: {
    fontSize: typography.body.fontSize,
    fontWeight: '500',
    marginBottom: 2,
  },
  header: {
    marginBottom: 12,
  },
  interventionBadge: {
    alignSelf: 'flex-start',
  },
  interventionText: {
    fontSize: typography.caption.fontSize,
    fontWeight: '500',
  },
  prediction: {
    fontSize: typography.bodySmall.fontSize,
  },
  subtitle: {
    fontSize: typography.bodySmall.fontSize,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  viewAllButton: {
    marginTop: 8,
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '500',
  },
});

export function themedAtRiskStyles(colors: SemanticColors) {
  return {
    container: {
      backgroundColor: colors.card,
      borderColor: colors.cardBorder,
    },
  } as const;
}
