import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const browseStyles = StyleSheet.create({
  backButton: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
    marginBottom: 12,
  },
  backButtonText: {
<<<<<<< HEAD
    color: '#374151',
    fontSize: 17,
=======
    color: colors.gray[700],
    fontSize: 15,
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
    fontWeight: '600',
  },
  browseContent: {
    paddingBottom: 40,
  },
});
