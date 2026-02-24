import { StyleSheet } from 'react-native';
import { typography, fontFamilies} from '@/theme/typography';

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
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    marginTop: 2,
  },
  noStreakTextContainer: {
    flex: 1,
  },
  noStreakTitle: {
    color: '#374151', // gray-700
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.bodySmall.fontSize,
    fontWeight: '600',
  },
});
