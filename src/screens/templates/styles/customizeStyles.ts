import { StyleSheet } from 'react-native';
import { colors } from '../../../theme/colors';

export const customizeStyles = StyleSheet.create({
  customizeSection: {
    marginTop: 4,
  },
  customizeSubtitle: {
    backgroundColor: colors.gray[50],
    borderRadius: 8,
<<<<<<< HEAD
    color: '#78716c',
    fontSize: 13,
=======
    color: colors.gray[500],
    fontSize: 10,
>>>>>>> 18d9d6cc (ui: replace hardcoded colors with theme tokens in templates & analytics screens)
    fontWeight: '500',
    overflow: 'hidden',
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  customizeTitle: {
    color: colors.gray[900],
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  customizeTitleRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    marginBottom: 4,
  },
});
