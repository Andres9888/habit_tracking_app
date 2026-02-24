import { StyleSheet } from 'react-native';
import { fontFamilies } from '@/theme/typography';

export const browseStyles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  backButtonText: {
    color: '#374151',
    fontFamily: fontFamilies.primary.text,
    fontSize: 17,
    fontWeight: '600',
  },
  browseContent: {
    paddingBottom: 40,
  },
});
