import { StyleSheet } from 'react-native';
import { typography } from '@/theme/typography';

export const noStreakStyles = StyleSheet.create({
  noStreakContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    paddingVertical: 4,
  },
  noStreakIcon: {
    marginRight: 12,
  },
  noStreakSubtext: {
    color: '#6b7280', // gray-500
    fontSize: typography.caption.fontSize,
    marginTop: 2,
  },
  noStreakTextContainer: {
    flex: 1,
  },
  noStreakTitle: {
    color: '#374151', // gray-700
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
});
