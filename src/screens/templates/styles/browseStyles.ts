import { StyleSheet } from 'react-native';
import { typography } from '../../../../theme/typography';

export const browseStyles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  backButtonText: {
    color: '#374151',
<<<<<<< HEAD
    fontSize: 17,
=======
    ...typography.bodySmall,
>>>>>>> bc0f7748 (ui: migrate hardcoded font sizes to typography tokens across auth + template screens)
    fontWeight: '600',
  },
  browseContent: {
    paddingBottom: 40,
  },
});
