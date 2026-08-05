import { StyleSheet } from 'react-native';
import { typography } from '@/theme/typography';

export const browseStyles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  backButtonText: {
    ...typography.button,
  },
  browseContent: {
    paddingBottom: 40,
  },
});
