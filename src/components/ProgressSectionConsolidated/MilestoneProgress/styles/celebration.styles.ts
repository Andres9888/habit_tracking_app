import { StyleSheet } from 'react-native';
import { typography, fontFamilies} from '@/theme/typography';

export const celebrationStyles = StyleSheet.create({
  celebrationContainer: {
    alignItems: 'center',
    backgroundColor: '#fefce8', // amber-50
    borderColor: '#fbbf24', // amber-400
    borderWidth: 1,
  },
  celebrationContent: {
    alignItems: 'center',
    padding: 8,
  },
  celebrationEmoji: {
    fontSize: 32,
    marginBottom: 4,
  },
  celebrationSubtext: {
    color: '#92400e', // amber-800
    fontFamily: fontFamilies.primary.text,
    fontSize: 13,
    fontWeight: '500',
  },
  celebrationTitle: {
    color: '#78350f', // amber-900
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.body.fontSize,
    fontWeight: '700',
    marginBottom: 2,
  },
  nextMilestoneText: {
    color: '#92400e', // amber-800
    fontFamily: fontFamilies.primary.text,
    fontSize: typography.caption.fontSize,
    marginTop: 8,
  },
});
